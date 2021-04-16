axios.get("http://127.0.0.1:5000/api").then(function ({ data }) {
  // add function calls here and implement functions below this axios function.
  TestFunction(data);

});

function TestFunction(data){
  console.log(data);
}



