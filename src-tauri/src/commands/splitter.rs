use tauri::AppHandle;
use crate::modules::stem_splitter;

#[tauri::command]
pub async fn split_stems(
    app: AppHandle,
    input: String,
    output: String
) -> Result<String, String> {
    stem_splitter::split(app, input, output).await
}
