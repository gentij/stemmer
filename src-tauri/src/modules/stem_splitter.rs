use stem_splitter_core::{split_file, SplitOptions, SplitProgress};
use tauri::{AppHandle, Emitter};
use std::path::Path;
use std::fs;

pub async fn split(app: AppHandle, input: String, output: String) -> Result<String, String> {
    let input_path = Path::new(&input);
    let file_stem = input_path
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("output");
    
    let base_output_path = Path::new(&output);
    let final_output_path = base_output_path.join(file_stem);
    let final_output = final_output_path.to_string_lossy().to_string();
    
    if !base_output_path.exists() {
        match fs::create_dir_all(base_output_path) {
            Ok(_) => eprintln!("  ✅ Base directory created successfully"),
            Err(e) => {
                eprintln!("  ❌ Failed to create base directory: {:?}", e);
                return Err(format!(
                    "Failed to create output directory '{}': {}. \n\nTroubleshooting:\n• Try selecting a different folder in Settings\n• Use Desktop or Downloads folder\n• Check if you have write permissions\n• Error code: {}", 
                    output, e, e.kind()
                ));
            }
        }
    }
    
    match fs::create_dir_all(&final_output_path) {
        Ok(_) => eprintln!("  ✅ Project folder created successfully"),
        Err(e) => {
            eprintln!("  ❌ Failed to create project folder: {:?}", e);
            return Err(format!(
                "Failed to create project folder '{}': {}. \n\nError code: {}", 
                final_output, e, e.kind()
            ));
        }
    }
    
    let test_file = final_output_path.join(".stemmer_write_test");
    match fs::write(&test_file, b"test") {
        Ok(_) => {
            eprintln!("  ✅ Write test successful");
            let _ = fs::remove_file(&test_file);
        }
        Err(e) => {
            eprintln!("  ❌ Write test failed: {:?}", e);
            return Err(format!(
                "No write permission for output directory '{}': {}. \n\nTroubleshooting:\n• The app may need permission to access this folder\n• Try Desktop or Downloads folder\n• On macOS, check System Settings > Privacy & Security > Files and Folders\n• Error code: {}", 
                final_output, e, e.kind()
            ));
        }
    }

    stem_splitter_core::set_download_progress_callback({
        let app = app.clone();
        move |downloaded, total| {
            let _ = app.emit(
                "split-progress",
                serde_json::json!({
                    "kind": "download",
                    "downloaded": downloaded,
                    "total": total
                }),
            );
        }
    });

    stem_splitter_core::set_split_progress_callback({
        let app = app.clone();
        let final_output_clone = final_output.clone();
        move |progress| {
            let payload = match progress {
                SplitProgress::Stage(stage) => serde_json::json!({"kind":"stage","stage":stage}),
                SplitProgress::Writing { stem, percent, .. } => {
                    serde_json::json!({"kind":"writing","stem":stem,"percent":percent})
                }
                SplitProgress::Finished => serde_json::json!({
                    "kind":"finished",
                    "output_path": final_output_clone
                }),
                _ => serde_json::json!({"kind":"noop"}),
            };
            let _ = app.emit("split-progress", payload);
        }
    });

    let options = SplitOptions {
        output_dir: final_output.clone(),
        ..Default::default()
    };

    tauri::async_runtime::spawn_blocking(move || {
        split_file(&input, options).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())??;

    Ok(final_output)
}
