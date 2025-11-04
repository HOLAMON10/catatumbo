carpathia.js
============

**carpathia.js** is a very simple translation module for [Node.js](http://nodejs.org).


Install
-------

To install **carpathia.js** into your project, type the following command:

    npm install carpathia --save

Use
---

To use **carpathia.js**, you first define a JSON object containing your translations and use **translate()** to return the correct string.

The following code shows how to use **carpathia.js**.

```javascript
var carpathia = require('carpathia');

var translations = {
    "en-US": {
      "phrase": "that's life"
    }
  , "fr-FR": {
      "phrase": "c'est la vie"
    }
};

console.log(carpathia.translate(translations, "fr-FR", "phrase")); // Outputs "c'est la vie"
```

Test
----

To run the unit tests, type the following command.

    npm test
