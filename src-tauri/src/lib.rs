mod modules;
use modules::stem_splitter;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn split_stems(input: &str, output: &str) -> Result<String, String> {
    stem_splitter::split(input, output)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, split_stems])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
