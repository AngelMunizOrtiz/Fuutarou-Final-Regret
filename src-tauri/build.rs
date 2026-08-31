fn main() {
    // Tauri embeds the Windows icon while compiling the native launcher. Tell
    // Cargo to rerun this build script when any generated platform icon changes;
    // otherwise an incremental build can keep the previous icon in the EXE.
    println!("cargo:rerun-if-changed=icons");
    println!("cargo:rerun-if-changed=tauri.conf.json");
    println!("cargo:rerun-if-changed=tauri.chapter1-demo.conf.json");
    println!("cargo:rerun-if-changed=tauri.full.conf.json");
    tauri_build::build()
}
