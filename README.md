# Hot-Collection

Hot-Collection is a javascript package that abstracts Firestore collections in feature rich data managements objects inside web apps. It automatically load data when it changes, exposes the basic data manipulation operations as methods and make the developer experience more flexible with features like data versioning and adapters.

## Motivation

As an independent solo developer i find myself somewhat obsessed by solutions that reduce the amount of repeated code I have do produce. In this regard Firestore is awesome. It is fast, reliable, well documented and easy to use. Even so, since Firebase is designed for a broad spectrum of use cases, i see myself repeating some infrastructure code to manage data between web apps.

This package aims to encapsulate this approach in a single class for data management objects that can make a developer life easily when interacting with Firestore. The goal is to help fellow developers focus more on business and less in technology.

# Usage

The library provides the `HotCollection` class. Each of it instances are capable to manage a Firestore collection. The class provides methods to read and manipulate data.

In a nutshell (think now i should use TL;DR) you create HotCollection objects passing a reference to Firestore and the collection name to the HotCollection constructor. After that you listen to updates by providing callbacks functions to the HotCollection subscribe method and manipulate collection's documents by calling add, set and del methods.

Let explore that in more detail.

## Getting Started

Install with npm.

    npm install @joaomelo/hot-collection

The first step is to import and instantiate a HotCollection object. The required arguments are the Firestore reference and the collection name. Let's see.

    import * as firebase from 'firebase/app';
    import 'firebase/firestore';
    import HotCollection from '@joaomelo/hot-collection';

    const fireApp = firebase.initializeApp({
      // config data
    });

    const firestoreDb = fireapp.firestore();
    itemsCol = new HotCollection(firestoreDb, 'items')

`ItemCol` will now expose features for reading and writing data in the Firestore `items` collection.

## Mocking the Database

The HotCollection constructor also accepts a string instead of the Firestore reference as it's first argument. That will make the HotCollection instance use an internal very simple database. You do it like that:

    const foo = new HotCollection('mock', 'foo')
    const bar = new HotCollection('mock', 'bar')

On those cases, all data will be stored in-memory and erased even between page reloads. 

This is useful for prototyping apps and experimenting with the package.

## Reading Data

Every update in the Firestore collection will trigger a HotCollection object to sync the corresponding data. The following sections will explain how to read that data inside you app.

### Items Property

The `items` property is an array with all the collection documents stored as javascript objects. Bellow we show the name field values inside an employee collection using the items property.
  
    import HotCollection from "@joaomelo/hot-collection";
    import { firebaseDb } from "./firebase-init";

    const db = firebaseDb || "mock";
    const employeeCol = new HotCollection(db, "items");
    employeeCol.add({ name: "John" });
    employeeCol.add({ name: "Jane" });

    const html = employeeCol.items.reduce((a, i) => a + `<p>${i.name}</p>`, "");
    document.getElementById("app").innerHTML = html;

> You can play with the example [here](https://codesandbox.io/embed/hot-collection-1-8770l?fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark).

The problem with that approach is that reading and writing data in Firestore is an asynchronous exercise. If the data changes, the UI will not update. Also, the `reduce` could be called before the HotCollection object finishes loading the documents from Firestore through the internet.

### Subscribing to Data Updates

A more reasonable solution is to subscribe to data updates. HotCollection instances expose the `subscribe` method. You pass a callback function to that method and that callback will be invoked every time the data changes. 

The callback function receives the array of documents as it first and only argument. Let's rewrite our last example.

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

HotCollection items property and the argument passed to subscriptions callbacks are pretty much the copies of the original documents inside the Firestore collection with few differences.

HotCollection will inject inside every item the Firestore document key as an `id` property. So, if you use id as a field in any collection things will break.

Also the object will not load any sub-collection subordinated to those documents.

In the last sections i will explain a optional and more flexible way the package offers to translate Firestore objects to app objects and vice-versa.

## Manipulating Data

HotCollection provides three methods to manipulate Firestore documents: `add`, `set` and `del`.

### Adding and Editing

To add a document just pass an object to the HotCollection object `add` method. An automatic id will be provided by Firestore. Bellow we make a tiny app to add employees to a Firestore collection.

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

If you want to edit an object or add it with an arbitrary id, use the `set` method. It also expects an object but you have to make sure this object has an `id` property inside. 

If a document with that id exists in the database collection all it's data will be replaced by the one found inside object you provided. If any document is found, a new document will be inserted and associated with that id value. Let's update out last example to add the edit capability.

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

To delete a document call the del method in a HotCollection object and pass the document id as argument. With few lines we can add the delete feature to our running example.

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

Just like that we have a simple record app syncing with a central database. Cool! But before wrapping up let us talk about a few more available package configurations and concerns you should take care.

## Options

HotCollection constructor has a third optional parameter for options. Take a look about a hypothetical use case taking advantage off all the parameters.
    
    import HotCollection from "@joaomelo/hot-collection";
    
    // others imports and initializations

    options = { 
      orderBy: 'some-field-name',
      adapters: {
        itemToDoc: someFunction,
        docToItem: otherFunction,
      },
      saveMode: 'safe'
    }

    const collection = new HotCollection(db, "employees", options);

Let's talk about thoose options.

### Ordering

The `orderBy` options property take a string value corresponding some field name in the collection. This will be use to order the items inside the collection. Yeah! That simple.

### Adapters

Adapter are functions apllyed to every item or doc before passing them to the next step. They are useful if you data structure does note represent how you would commonly use that collection in the business and ui layers.

Both function take a object as the argument and must return another object.

The function assigned to `itemToDoc` property will be called before adding and setting data to the database. It `docToItem` counterpart will be called before returning the database data to the HotCollection state items array.

### Versions to the rescue

The property `saveMode` accepts one of two string values: `'default'` and `'safe'`. All this README file until here describes the default behavior. When setted to `'safe'` an interesting behavior is activeted in HotCollection objects.

In safe mode every time a documented is added or setted a copy of it will be saved in a subcollection called `versions` inside the document. Together with all the field data of that version, HotCollection will insert the moment that document was modified and (if available) that id and email of the Firebase user who made the operation.

HotCollection will no expose that `version` subcollection data. You will to consult it in Firestore interface or access it with the Firebase native API. 

Other diference of safe mode is when `del` method is called in a HotCollection instead of deleting it's corresponding document in Firestore. A set operation  applting a new `deleted` field with the value `true` will be made.

So now deleted objects will still be available in the HotCollection items propert or as the arguments passed to subcribing callbacks.

Since items is an array you can filter those objects easily with the filter array functions like this:

    myHotCollection.items.filter(i => !i.deleted)

Or more exciting you could make the option available to the user to show or hide deleted objects. 

# Security Concerns

You should never trust client code. It is very easy to inject clients requests with malicious code to do all kind of nasty stuff with your database. 

The default approach to protect your Firestore database is with security rules. There are a lot of documentation on how to make them and adeher to best pratices. Some useful links bellow:

- Offical docs: [Get started with Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- This Fireship guy is awesome: [How to Hack a Firebase App](https://www.youtube.com/watch?v=b7PUm7LmAOw)

# Package Limitations

This package is very simple in its nature and has tons of limitations. But i want to make clear two of them becouse they could be a deal breaker to some of you.

## Subcollections

HotCollection do not handle subcollections at all. It can't load or manipulate them not as forst level collection or as subdocuments of one higher level HotCollection object.

Some needs that make people use subcollections could be achived with array and map fields. Maybe you want to look more into (those options)[https://firebase.google.com/docs/firestore/manage-data/data-types].

## Joins

One of the more dificult things to do in client code with Firestore is the equivalent traditional relational join of two tables. HotCollection do not support create objects crossing data between two collections for now. 

You could do that in app code. Most of the solutions i find out are based on server logic built upon Could Functions. The Fireship channel made a (video)[https://fireship.io/lessons/firestore-joins-similar-to-sql/] explaining a solution using Angular framework and RxJS library you can learn upon that.

# Demo

This repo has the package code inside the lib folder and also a demo app in the... demo folder. The web app is built with few packages more proeminent the Vue framework. You can use it to explore more the functionalities and potential of the library.

To run the the demo app you first you have to clone the repo.

    git clone https://github.com/joaomelo/vuetify-fireauth.git

Than create a `demo.env` file inside the demo/config folder with the variables assignments bellow. Replace the values with the real ones for your firebase project and give it a active Firebase active user credential. Don't forget to gitignore this env file so your Firebase that is exposed.

    FIREBASE_API_KEY=foobar
    FIREBASE_AUTH_DOMAIN=foobar.firebaseapp.com
    FIREBASE_DATABASE_URL=https://foobar.firebaseio.com
    FIREBASE_PROJECT_ID=foobar
    FIREBASE_STORAGE_BUCKET=foobar.appspot.com
    FIREBASE_MSG_SENDER_ID=foobar
    FIREBASE_APP_ID=1:foobar
    USER=user@user.us
    PASS=password

Then, install the dependencies and run the start script:

    npm install
    npm start

Have fun 🎉.

# Wrapping up

That was a lot. If you are still here, thank you for the attention. I have a daytime job, a wife and tree beautiful children to take care of. So i give my love to coding at late nights and weekends. I appreciate your interest and feedback.

# License

Made by [João Melo](https://www.linkedin.com/in/joaomelo81/?locale=en_US) and licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details