use std::{fmt::Debug, ops::Deref};

#[derive(Debug)]
struct MyBox<T: Debug>(T);
impl<T: Debug> MyBox<T> {
    fn new(x: T) -> Self {
        MyBox(x)
    }
}
impl<T: Debug> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> Drop for MyBox<T>
where
    T: Debug,
{
    fn drop(&mut self) {
        println!("Droping the value the {:?}", self.0)
    }
}

fn main() {
    let x = 5;
    let y = &x;

    println!("{:p}", &x);
    println!("{:p}", y);
    println!("{:p}", &y);

    let s = String::from("Hello");
    let b = &s;
    println!("Address of s: {:p} {:p}", &s, b);
    println!("Address of s.as_str(): {:p}", s.as_str());

    assert_eq!(5, *y); // dereferenced
    assert_eq!(5, x);
    // assert_eq!(5, y);  // no implementation for `{integer} == &{integer}`

    // Box implement the Deref trait which act same as a normal refrence
    let z = Box::new(x);
    assert_eq!(5, *z);

    // my custom box but it  doesn't store the value on heap, we are just testing for Deref trait
    let p = MyBox::new(x); // 
    assert_eq!(5, *p); // this is a syntatic sugar for `p.deref()` -> return refrence which then you use to defrerence `*(y.deref())`
    assert_eq!(5, *(p.deref()));

    let m = MyBox::new(String::from("hello"));
    let j = &(*m);
    say_hello(&m); // this below chain deref is done automatically by compiler
    // &MyBox<String> -> &String -> &str 
    say_hello(&(*m)[..]); // without auto-deref
    let j = &(*m)[..];

    // we can call the m.drop() because this will result in double free
    // use the drop function if you want do it explicity
    drop(m);
    println!("After drop");
}

fn say_hello(s: &str) {
    println!("{}", s)
}
