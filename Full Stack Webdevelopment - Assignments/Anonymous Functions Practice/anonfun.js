//anon function

var findSum = function(x, y) {
    return x + y;
}
    var findProduct = function(x, y) {
	return x * y;
    }

    //regular function

	function threeOperation(x, operation) {
	    return operation(3, x);
	}

//calling function

console.log(threeOperation(4, findSum));
console.log(threeOperation(5, findSum));
console.log(threeOperation(4, findProduct));
console.log(threeOperation(5, findProduct));

//expected output 7, 8, 12, 15