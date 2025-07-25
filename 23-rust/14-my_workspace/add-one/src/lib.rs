
/// Add one to the given value
/// 
/// ### Example:
/// ```
/// use add_one::add_one;
/// let mut num = 1;
/// num = add_one(num);
/// assert_eq!(num, 2);
/// ```
pub fn add_one<T>(mut num: T) -> T
where
    T: std::ops::Add<Output = T> + std::ops::AddAssign<i32>
{
    num += 1;
    num
}
