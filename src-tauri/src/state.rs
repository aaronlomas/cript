// CriptorClient lives in the criptor SDK so the engine stays framework-agnostic.
// We re-export it as `AppState` so lib.rs and the Tauri commands can find it.
pub use criptor::CriptorClient as AppState;
