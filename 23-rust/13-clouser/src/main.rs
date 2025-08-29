use std::collections::HashMap;
use std::thread;
use std::time::Duration;

// all closuer implement one of these traits
// Fn -> immutablity borrow the values
// FnMut -> mutablity borrows the value
// FnOnce -> take the ownership of the value, can't be called again, think why ?
// Because FnOnce closures can move (take ownership of) captured variables. 
// Once ownership is moved, the closure can't be called again since the captured values are no longer available.

struct Cacher<T>
where
    T: Fn(u32) -> u32,
{
    calulcation: T,
    value: HashMap<u32, u32>,
}

impl<T: Fn(u32) -> u32> Cacher<T> {
    fn new(calulcation: T) -> Cacher<T> {
        Cacher {
            calulcation,
            value: HashMap::new(),
        }
    }

    fn value(&mut self, arg: u32) -> u32 {
        match self.value.get(&arg) {
            Some(val) => *val,
            None => {
                let v = (self.calulcation)(arg);
                self.value.insert(arg, v);
                return v;
            }
        }
    }
}

fn main() {
    // clousers are like functions which are anonumous, means don't have names
    // that can be stored as variable and passed around like args
    // they also capture the variable in the scope they are defined

    // |num: u32| -> u32
    let expensive_closure = |num| {
        println!("calculating slowly...");
        thread::sleep(Duration::from_secs(2));
        num
    };

    // we don't need to call anotate the type because when the first time the closure is called it will infere its type and use that,
    // but if you try sending another type after that call it will not compile because it infer the type of the first call.
    // yeah, you can also anotate the types if you want
    let res = expensive_closure(20);
    // expensive_closure("string");

    // they can even be a one liner
    let example_closure = |x| x * x;
    let result = example_closure(2);
    // example_closure("boom"); // you can do this

    let cacher = Cacher::new(|num| {
        println!("calculating slowly...");
        thread::sleep(Duration::from_secs(2));
        num
    });

    {
        let x = 4;
        let equal_to_x = |z| x == z;
        let y = 4;
        assert!(equal_to_x(y));
        println!("{x}");
    }

    // we could use force the to take the ownership of the value by using `move` keyword
    let x = vec![1, 2, 3];
    let equal_to_x = move |z| z == x;
    // println!("cat use x here {:?}", x); 
    let y =  vec![1, 2, 3];
    assert!(equal_to_x(y));

}
