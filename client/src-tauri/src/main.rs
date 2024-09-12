// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Child, Stdio};
use std::sync::{Arc, Mutex};
use std::thread::sleep;
use std::time::Duration;
use reqwest::blocking::get;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Function to check if the server is up
fn wait_for_server_ready() {
    loop {
        if let Ok(_) = get("http://localhost:8000") {
            break; // Exit the loop once the server is reachable
        }
        sleep(Duration::from_secs(1)); // Retry every 1 second
    }
    sleep(Duration::from_secs(1)); // Additional delay after server starts
}

fn main() {
    // Use Arc<Mutex<>> to safely share the child process between threads
    let server_process: Arc<Mutex<Option<Child>>> = Arc::new(Mutex::new(None));

    // Clone the Arc to move it into the Tauri event loop
    let server_process_clone = Arc::clone(&server_process);

    tauri::Builder::default()
        .setup(move |app| {
            // let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("main").unwrap();

            // Start the server in a new thread
            std::thread::spawn(move || {
                // Start the server executable in the background (without a new console window)
                let child = Command::new("bin/GardenErp.exe")
                    .stdout(Stdio::null()) // Do not open a console window for the server
                    .stderr(Stdio::null()) // Redirect stderr
                    .spawn()
                    .expect("failed to start server");

                // Store the child process in the mutex
                *server_process.lock().unwrap() = Some(child);

                // Wait for the server to be ready
                wait_for_server_ready();

                // Show the main window and hide the splash screen
                main_window.show().unwrap();
                // splashscreen_window.close().unwrap();
            });

            Ok(())
        })
        // Handle the window close event to clean up the server process
        .on_window_event(move |event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event.event() {
                // Lock and terminate the server process
                if let Some(mut child) = server_process_clone.lock().unwrap().take() {
                    child.kill().expect("failed to kill server process");
                    child.wait().expect("failed to wait for server process to exit");
                }
            }
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
