use std::{thread, time::Duration, vec};

// Rust standard library doesn't include Green thread, becasue it require a runtime for these green threads
// But it provide 1-1 thread or Navtive thread which is in standard library and managed by operating system

fn main() {
    let v1 = vec![1, 2, 3, 4, 5];

    let handle = thread::spawn(move || {
        println!("{v1:?}");
        for i in 1..10 {
            println!("hi from thread {i}");
            thread::sleep(Duration::from_millis(100));
        }
    });

    // drop(v1); // owner ship is moved inside the clouser

    handle.join().unwrap();

    for i in 1..5 {
        println!("hi from main thread {i}");
        thread::sleep(Duration::from_millis(100));
    }
}
