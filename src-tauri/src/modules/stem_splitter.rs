use stem_splitter_core::{split_file, SplitConfig};

pub fn split() -> Result<String, String> {
    println!("split_file method called");
    let config = SplitConfig::default().output_dir("output");

    let result = split_file("assets/test.wav", config).expect("Pipeline failed");

    println!(
        "✅ Split complete: vocals={}, drums={}, bass={}, other={}",
        result.vocals.len(),
        result.drums.len(),
        result.bass.len(),
        result.other.len()
    );

    Ok("Splitting complete".into())
}
