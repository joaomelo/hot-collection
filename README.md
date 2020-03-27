# Hot-Collection

Hot-Collection is a javascript package that abstracts [Firestore](https://firebase.google.com/docs/firestore) collections read and write operations in simple to use data management objects. Those objects automatically load data when it changes and exposes the basic CRUD actions as methods. The package also offers complimentary features like data versioning and adapters.

## Motivation

As an independent solo developer, I find myself somewhat obsessed with solutions that reduce the amount of repeated code I have do produce. 

In this regard Firestore is awesome. It is fast, reliable, well documented and easy to use. Even so, since Firebase is designed for a broad spectrum of use cases, the need to duplicate code to manage data between web apps is not uncommon.

This package tries to encapsulate some of that replication in a single reusable class. The goal is to help fellow developers focus more on business and less on technology.

# Usage

The library provides the `HotCollection` class. Each of its instances is capable to manage a Firestore collection. The class provides methods to read and manipulate data.

In a nutshell, you create HotCollection objects passing a reference to Firestore and the collection name to its constructor. After that, you listen to updates by providing callbacks functions to the subscribe method and manipulate collection's documents by calling add, set and del methods.

Let explore that in more detail.

## Getting Started

Install with npm.

    npm install @joaomelo/hot-collection

The first step is to import and instantiate a HotCollection object. The required parameters are the Firestore reference and the collection name. Let's see.

    import * as firebase from 'firebase/app';
    import 'firebase/firestore';
    import HotCollection from '@joaomelo/hot-collection';

    const fireApp = firebase.initializeApp({
      // config data
    });

    const db = fireapp.firestore();
    itemsCol = new HotCollection(db, 'items')

The `itemsCol` will now expose features for reading and writing data in the Firestore corresponding `items` collection.

## Mocking the Database

The HotCollection constructor also accepts a string instead of the Firestore reference as first argument. That will make the HotCollection instance use a very simple internal database. Like that:

    const foo = new HotCollection('mock', 'foo')
    const bar = new HotCollection('mock', 'bar')

In those cases, all data will be stored in memory and erased even between page reloads. 

This is useful for prototyping apps and experimenting with the package.

## Reading Data

Every Firestore collection update triggers the HotCollection object to sync corresponding data. The following sections explain how to read that data.

### Items Property

The `items` property is an array with all collection documents stored as javascript objects. Bellow, we show in the browser the name field values inside an employee collection using the items property.
  
    import HotCollection from "@joaomelo/hot-collection";
    import { firebaseDb } from "./firebase-init";

    const db = firebaseDb || "mock";
    const employeeCol = new HotCollection(db, "items");
    employeeCol.add({ name: "John" });
    employeeCol.add({ name: "Jane" });

    const html = employeeCol.items.reduce((a, i) => a + `<p>${i.name}</p>`, "");
    document.getElementById("app").innerHTML = html;

> You can play with the example [here](https://codesandbox.io/embed/hot-collection-1-8770l?fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark).

But reading and writing in Firestore is an asynchronous exercise. In the last example, the UI will not update if employee data changes. Also, we have no guarantee that the HotCollection object finished loading Firestore's documents when `reduce` is called.

### Subscribing to Data Updates

A more reasonable solution is to subscribe to data updates. HotCollection instances expose the `subscribe` method. You pass a callback function to the subscribe method and that callback will be invoked every data change. 

The callback function receives the array of documents as its first and only argument. Let's rewrite our last example.

    import HotCollection from "@joaomelo/hot-collection";
    import { firebaseDb } from "./firebase-init";

    const db = firebaseDb || "mock";
    const employeeCol = new HotCollection(db, "items");

    const app = document.getElementById("app");
    const reducer = (a, i) => a + `<p>${i.name}</p>`;
    employeeCol.subscribe(items => {
      app.innerHTML = employeeCol.items.reduce(reducer, "");
    });

    employeeCol.add({ name: "John" });
    employeeCol.add({ name: "Jane" });

> You can play with the example [here](https://codesandbox.io/embed/hot-collection-sub-5lux1?fontsize=14&hidenavigation=1&theme=dark).

Cool! But what is really inside that argument the subscription passes to all callbacks when the change event is published?

### What is an Item?

HotCollection items property and the argument passed to subscription callbacks are pretty much the copies of the original documents inside the Firestore collection with few differences.

HotCollection will inject inside every item the Firestore document key as an `id` property. So, don't use id as a field in any collection or things will break.

Also, the HotCollection object will not load any sub-collection subordinated to its documents.

In the last sections, I will explain an optional and more flexible way the package offers to translate Firestore documents to app objects and vice-versa.

## Manipulating Data

HotCollection provides three methods to manipulate Firestore documents: `add`, `set` and `del`.

### Adding and Editing

To add a document just pass an object to the HotCollection `add` method. An automatic id will be provided by Firestore. Bellow, we make a tiny app to add employees to a Firestore collection.

    import HotCollection from "@joaomelo/hot-collection";
    import { firebaseDb, renderEmployee } from "./helpers";

    const get = id => document.getElementById(id);

    const db = firebaseDb || "mock";
    const employeeCol = new HotCollection(db, "employees");

    employeeCol.subscribe(items => {
      get("list").innerHTML = items.reduce((a, e) => a + renderEmployee(e), "");
    });

    get("save").addEventListener("click", () => {
      employeeCol.add({
        name: get("name").value,
        dpto: get("dpto").value
      });
      get("name").value = "";
      get("dpto").value = "";
    });

> You can play with the example above [here](https://codesandbox.io/embed/hot-collection-manipulate-lcj2e?fontsize=14&hidenavigation=1&theme=dark).

If you want to edit a document or add one with an arbitrary id, use the `set` method. It also expects an object parameter but you have to make sure this object has an `id` property. 

If a document with that id already exists in the Firestore collection all it's data will be replaced by what is inside the object you provided. If no document is found, a new one will be inserted and associated with the id. Let's update the last example with the editing capability.

    import HotCollection from "@joaomelo/hot-collection";
    import { fireDb, renderEmployee, getById, getAll, resetInputs } from "./helpers";

    const db = fireDb || "mock";
    const employeeCol = new HotCollection(db, "employees");

    employeeCol.subscribe(items => {
      getById("list").innerHTML = items.reduce((a, e) => a + renderEmployee(e), "");
      getAll(".edit-btn").forEach(btn => {
        btn.onclick = loadEmployee;
      });
    });

    getById("save").addEventListener("click", () => {
      const employee = {
        name: getById("name").value,
        dpto: getById("dpto").value
      };

      if (getById("id").value) {
        employee.id = getById("id").value;
        employeeCol.set(employee);
      } else {
        employeeCol.add(employee);
      }

      resetInputs();
    });

    function loadEmployee() {
      const e = employeeCol.getItem(this.id);
      getById("id").value = e.id;
      getById("name").value = e.name;
      getById("dpto").value = e.dpto;
    }

> You can play with the example above [here](https://codesandbox.io/embed/hot-collection-set-tvn5t?fontsize=14&hidenavigation=1&theme=dark).

### Deleting

To delete a document just call the `del` method in any HotCollection object. The only parameter is the document id. With few lines, we can add the delete feature to our running example.

    import HotCollection from "@joaomelo/hot-collection";
    import { fireDb, renderEmployee, getById, getAll, resetInputs } from "./helpers";

    const db = fireDb || "mock";
    const employeeCol = new HotCollection(db, "employees");

    employeeCol.subscribe(items => {
      getById("list").innerHTML = items.reduce((a, e) => a + renderEmployee(e), "");
      getAll(".edit-btn").forEach(btn => {
        btn.onclick = loadEmployee;
      });
      getAll(".del-btn").forEach(btn => {
        btn.onclick = delEmployee;
      });
    });

    getById("save").addEventListener("click", () => {
      const employee = {
        name: getById("name").value,
        dpto: getById("dpto").value
      };

      if (getById("id").value) {
        employee.id = getById("id").value;
        employeeCol.set(employee);
      } else {
        employeeCol.add(employee);
      }

      resetInputs();
    });

    function loadEmployee() {
      const e = employeeCol.getItem(this.dataset.id);
      getById("id").value = e.id;
      getById("name").value = e.name;
      getById("dpto").value = e.dpto;
    }

    function delEmployee() {
      employeeCol.del(this.dataset.id);
    }

> You can play with the example above [here](https://codesandbox.io/embed/hot-collection-del-zcp8c?fontsize=14&hidenavigation=1&theme=dark).

Just like that, we have a simple record app syncing with a central database. Sweet! But before wrapping up let us talk about a few more optional configurations and some concerns you should take care of.

## Options

HotCollection constructor has a third optional parameter for options. Below we have a hypothetical use case taking advantage of all the parameters.

    import HotCollection from "@joaomelo/hot-collection";
    
    // proper imports and initializations

    options = { 
      orderBy: 'some-field-name',
      adapters: {
        itemToDoc: someFunction,
        docToItem: otherFunction,
      },
      saveMode: 'safe'
    }

    const collection = new HotCollection(db, "employees", options);

Let's talk about those options.

### Ordering

The `orderBy` property takes a string corresponding to a field name in the collection. This will be used to order the items' property inside the HotCollection. Yeah! That simple.

### Adapters

Adapters are functions applied to every item or doc before passing them to the next step. They are useful if your data structure does not represent how you use it in the business and UI layers.

Both functions have an object as the only parameter and return another object as the transformed data.

The function assigned to `itemToDoc` property will be called before adding and setting data to the database. The `docToItem` counterpart will be called before returning the database document to the HotCollection items array.

### Versions to the rescue

The property `saveMode` accepts one of two string values: `'default'` or `'safe'`. All this README until here describes the default way. When set to `'safe'` an interesting behavior is activated.

In safe mode, every time a document is added or set, a copy of it will be saved in a `versions` subcollection inside the same document. HotCollection will also insert the moment that document was modified and (if available) that id and email of the Firebase user who made the operation.

HotCollection will not expose that `version` subcollection data. You will have to consult the admin Firestore interface or access the subcollection with the native API.

Another difference of safe mode is when `del` method is called, instead of deleting the document in Firestore. A set operation will apply a `deleted` field with the value `true`.

So, deleted documents will still be available in the HotCollection . Since the `items` property is an array, you can take advantage of array functions like this:

    myHotCollection.items.filter(i => !i.deleted)

Or more exciting, you could let the user choose when to show or hide deleted objects. 

That's enough of the good stuff, now we talk about boring things.

# Security Concerns

You should never trust the client-side code. It is very easy to inject clients' requests with malicious code to do all kinds of nasty things with your database. 

The default approach to protect your Firestore database is with security rules. There is a lot of documentation on how to use them and adhere to the best practices. Some useful links below:

- Official docs: [Get started with Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- This Fireship guy is awesome: [How to Hack a Firebase App](https://www.youtube.com/watch?v=b7PUm7LmAOw)

# Package Limitations

This package is very simple in its nature and has tons of limitations. But I want to make clear two of them because they could be a deal-breaker to you.

## Subcollections

HotCollection does not handle subcollections at all. It can't load or manipulate them. Not as first-level collections or as properties inside high-level items.

Some goals that make people use subcollections could be achieved with array and map fields. Maybe you want to look more into [those options](https://firebase.google.com/docs/firestore/manage-data/data-types).

## Joins

One of the more difficult things to do in client code with Firestore is what would be the equivalent to traditional relational joins of two tables. HotCollection does not support create objects with union data between two collections. At least for now.

You could do that inside your app code. Most of the solutions I found were based on server logic built upon [Could Functions](https://firebase.google.com/docs/functions). The Fireship website made a [video](https://fireship.io/lessons/firestore-joins-similar-to-sql/) explaining a solution based on Angular and RxJS, you can expand upon that.

# Demo

This repo has the package code inside the lib folder and also a demo folder with a web app. You can use it to learn or explore the functionalities and potentials of the library.

To run the demo you first have to clone the repo.

    git clone https://github.com/joaomelo/hot-collection.git

Then create a `demo.env` file inside the demo/config folder. Fill that file with the variables assignments bellow. Replace the values with the real ones for your firebase project and of an active Firebase user email and password. Don't forget to add the demo.env file to your ".gitignore".

    FIREBASE_API_KEY=foobar
    FIREBASE_AUTH_DOMAIN=foobar.firebaseapp.com
    FIREBASE_DATABASE_URL=https://foobar.firebaseio.com
    FIREBASE_PROJECT_ID=foobar
    FIREBASE_STORAGE_BUCKET=foobar.appspot.com
    FIREBASE_MSG_SENDER_ID=foobar
    FIREBASE_APP_ID=1:foobar
    USER=user@user.us
    PASS=password

Now install the dependencies and run the start script:

    npm install
    npm start

Have fun 🎉.

# Wrapping up

That was a lot. If you are still here, thank you for your attention. I have a daytime job, a wife and three wonderful children to take care of. So I give my love to coding at late nights and weekends. I appreciate your interest and feedback.

# License

Made by [João Melo](https://www.linkedin.com/in/joaomelo81/?locale=en_US) and licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details