use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use crate::List::{Cons, Nil};

fn main() {
    // Refrence Counter
    // let take an example of graph node which is pointed by multiple edges so it has multple owner, and we don't want drop the value untils some is not pointing
    // Rc
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    println!("{}", Rc::strong_count(&a));
    let c = Cons(4, Rc::clone(&a)); // prefered syntax
    println!("{}", Rc::strong_count(&a));
    {
        let b = Cons(3, a.clone());
        println!("{}", Rc::strong_count(&a));
    }
    println!("{}", Rc::strong_count(&a));
}
