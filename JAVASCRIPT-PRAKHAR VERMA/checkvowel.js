list=['a','e','i','o','u','A','E','I','O','U'];
function checkvowel() {
    let str=prompt("Enter a string to check all the characters:");
    for(const i=0;i<str.length;i++){
        if(list.includes(str[i])){
            console.log(str[i]+" is a Vowel");
        }
}}