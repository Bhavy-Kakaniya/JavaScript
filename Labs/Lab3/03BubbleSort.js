<!DOCTYPE html>
<html>
<head>
    <title>Search Word in Sentence</title>
</head>
<body>
    <script>
        let sentence = "The quick brown fox jumps over the lazy dog";
        let words = sentence.split(" ");  // Convert sentence into array of words
        let searchWord = prompt("Enter a word to search:").toLowerCase();
        let index = -1;
        for (let i = 0; i < words.length; i++) {
            if (words[i].toLowerCase() === searchWord) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            document.write("found at index " + index)
            // alert(`Word found at index ${index}`);
        } else {
            document.write("Word not found in sentence.")
            // alert("Word not found in sentence.");
        }
    </script>
</body>
</html>
