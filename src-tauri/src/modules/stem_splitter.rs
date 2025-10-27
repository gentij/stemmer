use stem_splitter_core::{split_file, SplitOptions, SplitProgress};
use tauri::{AppHandle, Emitter};

pub async fn split(app: AppHandle, input: String, output: String) -> Result<String, String> {
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
        move |progress| {
            let payload = match progress {
                SplitProgress::Stage(stage) => serde_json::json!({"kind":"stage","stage":stage}),
                SplitProgress::Writing { stem, percent, .. } => {
                    serde_json::json!({"kind":"writing","stem":stem,"percent":percent})
                }
                SplitProgress::Finished => serde_json::json!({"kind":"finished"}),
                _ => serde_json::json!({"kind":"noop"}),
            };
            let _ = app.emit("split-progress", payload);
        }
    });

    let options = SplitOptions {
        output_dir: output.clone(),
        ..Default::default()
    };

    tauri::async_runtime::spawn_blocking(move || {
        split_file(&input, options).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())??;

    Ok("Splitting complete".into())
}
