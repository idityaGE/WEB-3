use std::sync::mpsc;
use std::{thread, time::Duration};

fn main() {
    let (tx, rx) = mpsc::channel();

    let handle = thread::spawn(move || {
        let msg = String::from("msg from spawned thead");
        println!("sending msg from spawned thead...");
        thread::sleep(Duration::from_secs(2));
        tx.send(msg).unwrap();
        // println!("msg is {msg}"); // value is moved to the main thread
        println!("Meassage Sent");
    });

    println!("Waiting to recv the message");

    let recived = rx.recv().unwrap(); // this will block the current excution until value is recived
    // let recived = rx.try_recv().expect("No message got"); // this will not block the thread, instead return a result type
    println!("Got: {}", recived);

    handle.join().unwrap();

    let (tx, rx) = mpsc::channel();
    let tx1 = tx.clone();
    thread::spawn(move || {
        let vals = vec![1, 3, 5, 6, 8, 0, 0];
        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(300));
        }
    });
    thread::spawn(move || {
        let vals = vec![9, 5, 32, 6, 3, 2];
        for val in vals {
            tx1.send(val).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });
    for rechived in rx {
        println!("Got {rechived}");
    }
}
