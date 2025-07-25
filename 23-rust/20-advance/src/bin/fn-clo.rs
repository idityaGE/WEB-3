fn add_one(x: i32) -> i32 {
    x + 1
}
fn do_twice(f: fn(i32) -> i32, args: i32) -> i32 {
    f(args) + f(args)
}

fn do_twiceC<T>(f: T, args: i32) -> i32
where
    T: Fn(i32) -> i32,
{
    f(args) + f(args)
}

// Fn, FnMut, FnOnce

fn main() {
    let answer = do_twice(add_one, 5);
    assert_eq!(12, answer);

    let ans = do_twiceC(|x| x + 1, 5);
    assert_eq!(12, ans);
}

fn return_closure() -> impl Fn(i32) -> i32 {
    |x| x + 1
}

fn fail_closure_return(a: i32) -> Box<dyn Fn(i32) -> i32> {
    // each closure is a diff type

    // if a > 0 {
    //     move |b| a + b
    // } else {
    //     move |b| a - b
    // }

    if a > 0 {
        Box::new(move |b| a + b)
    } else {
        Box::new(move |b| a - b)
    }
}
