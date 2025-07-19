use std::{
    // rc::Rc,
    sync::{Arc, Mutex},
    thread,
};

fn main() {
    // let m = Mutex::new(5);

    // {
    //     let mut num = m.lock().unwrap(); // automatic unlock when it goes out of the scope
    //     //* */ just create a block in which is going to be your critical section
    //     *num = 6;
    // }

    // println!("{m:#?}");

    //===============================

    // let counter = Rc::new(Mutex::new(0)); // Rc is not thread safe, the trait `Send` is not implemented for `Rc<Mutex<T>>``
    let counter = Arc::new(Mutex::new(0)); // Atomic Refrence Counting pointer, they are concurrency primitive
    let mut handlers = vec![];
    for _ in 1..=10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap(); // counter is immutable but we get the mutable refrence, because Mutex uses interier mutablity pattern like `RefCell`
            *num += 1;
        });
        handlers.push(handle);
    }

    for handle in handlers {
        handle.join().unwrap();
    }

    println!("{counter:?}");
}
