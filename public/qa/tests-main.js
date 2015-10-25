suite('Map Tests', function(){
	test('page has a map div on it',function(){
		assert(document.getElementById("map")  );
	});
	test('page has a input for zip codes', function(){
		assert(document.getElementsByTagName("input") &&
				document.getElementById('cpa_input'));
	});
	test('Google maps js is loaded',function(){
		assert(google.maps !== null);
	});
	test('GetValues fuction js is loaded',function(){
		assert(getValues !== null);
	});
});