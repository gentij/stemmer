use crate::modules::stem_splitter;
use tauri::AppHandle;

#[tauri::command]
pub async fn split_stems(
    app: AppHandle,
    input: String,
    output: String,
    acceleration: stem_splitter::AccelerationSettings,
) -> Result<String, String> {
    stem_splitter::split(app, input, output, acceleration).await
}
