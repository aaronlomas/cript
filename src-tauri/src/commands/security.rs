use crate::state::AppState;
use criptor::auth::TotpSetupPayload;
use tauri::State;

#[tauri::command]
pub async fn totp_is_enabled(state: State<'_, AppState>) -> Result<bool, String> {
    state.totp_is_enabled().await
}

#[tauri::command]
pub async fn totp_setup(state: State<'_, AppState>) -> Result<TotpSetupPayload, String> {
    state.totp_setup().await
}

#[tauri::command]
pub async fn totp_verify_setup(code: String, state: State<'_, AppState>) -> Result<bool, String> {
    state.totp_verify_setup(&code).await
}

#[tauri::command]
pub async fn totp_check(code: String, state: State<'_, AppState>) -> Result<bool, String> {
    state.totp_check(&code).await
}

#[tauri::command]
pub async fn totp_recovery_check(code: String, state: State<'_, AppState>) -> Result<bool, String> {
    state.totp_recovery_check(&code).await
}

#[tauri::command]
pub async fn totp_disable(state: State<'_, AppState>) -> Result<(), String> {
    state.totp_disable().await
}

#[tauri::command]
pub fn is_vault_locked(state: State<'_, AppState>) -> bool {
    state.is_locked()
}

#[tauri::command]
pub fn remote_session_active() -> bool {
    criptor::security::environment_check()
}
