mod modules;
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .register_asynchronous_uri_scheme_protocol("audio", |_app, request, responder| {
            // Custom audio:// protocol with CORS headers for WaveSurfer
            tauri::async_runtime::spawn(async move {
                let uri_str = request.uri().to_string();
                
                let encoded_path = if let Some(stripped) = uri_str.strip_prefix("audio://localhost") {
                    stripped.to_string()
                } else {
                    uri_str.split("://").nth(1).unwrap_or("")
                        .trim_start_matches("localhost")
                        .to_string()
                };

                let path = match urlencoding::decode(&encoded_path) {
                    Ok(decoded) => {
                        let decoded_str = decoded.to_string();
                        // On Windows, we might need additional handling for drive letters
                        #[cfg(target_os = "windows")]
                        let path = decoded_str.trim_start_matches('/').to_string();
                        #[cfg(not(target_os = "windows"))]
                        let path = decoded_str;
                        
                        path
                    }
                    Err(e) => {
                        eprintln!("Failed to decode path: {}", e);
                        encoded_path
                    }
                };
                
                match tokio::fs::read(&path).await {
                    Ok(data) => {
                        let content_type = if path.ends_with(".mp3") {
                            "audio/mpeg"
                        } else if path.ends_with(".wav") {
                            "audio/wav"
                        } else if path.ends_with(".m4a") {
                            "audio/mp4"
                        } else if path.ends_with(".flac") {
                            "audio/flac"
                        } else if path.ends_with(".ogg") {
                            "audio/ogg"
                        } else if path.ends_with(".aac") {
                            "audio/aac"
                        } else {
                            "application/octet-stream"
                        };

                        let response = http::Response::builder()
                            .status(200)
                            .header("Access-Control-Allow-Origin", "*")
                            .header("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD")
                            .header("Access-Control-Allow-Headers", "*")
                            .header("Access-Control-Expose-Headers", "Content-Length, Content-Type, Accept-Ranges")
                            .header("Content-Type", content_type)
                            .header("Content-Length", data.len().to_string())
                            .header("Accept-Ranges", "bytes")
                            .header("Cache-Control", "public, max-age=31536000")
                            .body(data)
                            .unwrap();

                        responder.respond(response);
                    }
                    Err(e) => {
                        eprintln!("Failed to read file {}: {}", path, e);
                        let response = http::Response::builder()
                            .status(404)
                            .body(Vec::new())
                            .unwrap();
                        responder.respond(response);
                    }
                }
            });
        })
        .invoke_handler(tauri::generate_handler![commands::split_stems])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
