use tokio::time::sleep;
use std::time::Duration;

//* REF: https://www.youtube.com/watch?v=K8LNPYNvT-U

// Using await on Future is only allowed inside another Future (means async fn)
// However for the top level Future (which is in main fn),
// we need some code which will manualy poll the Future to completion,
// and that code is called runtime or excecutor
// other language like c# and js have built-in runtime,
// but rust doesn't have built-in.
// it has cummnunity built called `tokio`

// Future in rust is lazy (I don't understand what this means),

// To run our async code concurrently we can use "tokio tasks"
//  task is similar to goroutine is golang (a green thread)
// it allow top level future to run concurrently

// by this macro flavor the task will run concurrently using time slicing instread of seperate thread;
// #[tokio::main(flavor = "current_thread")]
#[tokio::main]
async fn main() {
    // We cannot just call the async function just like that we
    // Futures do nothing unless you `.await` or poll them.
    //! do_something();

    // we have to add the await, but await can only be used in async fn
    // and async cannot be applied to the 'main' fn
    //* do_something().await;

    // we can store the returned Future in a variable and called await later
    //* let f = do_something();
    //* println!("Before Future");
    //* f.await;

    let mut handlers = vec![];
    for i in 0..2 {
        // "move" is used so that the async block could take ownership the varible in their env
        let handle = tokio::spawn(async move {
            do_something(i).await;
        });
        handlers.push(handle);
    }

    for handle in handlers {
        handle.await.unwrap();
    }
}

// #===== UNDERLINE ======#

// trait Future {
//     type Output;
//     fn poll(&mut self, wake: fn()) -> Poll<Self::Output>;
// }

// enum Poll<T> {
//     Ready(T),
//     Pending
// }

// fn do_something() -> impl Future<Output = ()> {
//     println!("I am async function!");
// }

// #======================#

async fn do_something(i: u32) {
    println!("[{i}] I am async function!");
    let s1 = read_from_database().await;
    println!("[{i}] First result : {s1}");
    let s2 = read_from_database().await;
    println!("[{i}] Second result : {s2}");
}

async fn read_from_database() -> String {
    sleep(Duration::from_millis(50)).await;
    "DB Result".to_owned() // Creates owned data from borrowed data, usually by cloning.
}
