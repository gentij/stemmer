## 🎧 Stemmer vX.Y.Z

Stemmer now ships with `stem-splitter-core 1.2.0`, bringing major under-the-hood
improvements to split performance and acceleration reliability.

---

### ✨ What’s New

- New acceleration settings in the app:
  - `Auto`
  - `CPU only`
  - `Preferred provider`
- Updated core engine to `stem-splitter-core 1.2.0`
- Better execution-provider fallback and health checks

### 🛠 Improvements

- Faster split times in testing, with improvements up to ~40% on some setups
- Better Apple Silicon/CoreML behavior
- Lower memory and post-processing overhead during splits
- More reliable acceleration handling across platforms

### 🐛 Fixes

- Improved fallback behavior when a GPU/provider path is unhealthy
- More consistent splitting behavior across different machines

---

### 📦 Downloads

- **macOS (Apple Silicon / arm64):**
  - `Stemmer_X.Y.Z_aarch64.dmg`
- **Windows:**
  - `.msi`
- **Linux:**
  - `.deb`
  - `.AppImage`

---

### ⚠️ Notes

- Acceleration setting changes require restarting Stemmer before the next split
- Depending on your machine and model, `CPU only` may still be faster than GPU-backed acceleration
- Intel macOS builds are not currently published with the current ONNX Runtime setup; macOS releases target Apple Silicon

### ⚠️ macOS Security Notice

Stemmer is currently not code-signed.

On first launch:

1. Right-click the app
2. Click **Open**
3. Confirm **Open**

---

### 🐞 Feedback

Please report bugs or feature requests via GitHub Issues.
