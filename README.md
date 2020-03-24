THIS PACKAGE IS IN IT FINAL ADJUSTMENTS PHASE FOR FIRST FUNCTIONAL RELEASE. PLEASE, DOT NOT INSTALL IT RIGHT NOW. 

# Hot-Collection

Hot-Collection is a javascript package that abstracts Firestore collections in feature rich data managements objects inside web apps. It automatically load data when it changes, exposes the basic data manipulation operations as methods and make the developer experience more flexible with features like data versioning and adapters.

## Motivation

As an independent solo developer i find myself somewhat obsessed by solutions that reduce the amount of repeated code I have do produce. In this regard Firestore is awesome. It is fast, reliable, well documented and easy to use. Even so, since Firebase is designed for a broad spectrum of use cases, i see myself repeating some infrastructure code to manage data between web apps.

This package aims to encapsulate this approach in a single class for data management objects that can make a developer life easily when interacting with Firestore. The goal is to help fellow developers focus more on business and less in technology.

# Usage

The library provides the `HotCollection` class. Each of it instances are capable to manage a Firestore collection. The class provides methods to read and manipulate data.

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

The HotCollection constructor also accepts a string instead of the firestore reference as it's first argument. That will make the HotCollection instance use an internal very crud database.  

    const foo = new HotCollection('mock', 'foo')
    const bar = new HotCollection('mock', 'bar')

On those cases, all data will be stored in-memory and erased even between page reloads. 

This is useful for prototyping apps and experimenting with the package.

## Reading Data

Every update in the Firestore collection will trigger a HotCollection object to sync the corresponding data.

### Items Property

This corresponding data is exposed in the `items` array property. All the collection documents are stored as javascript objects. Bellow we show the name field values inside an employee collection.
  
    import HotCollection from "@joaomelo/hot-collection";
    import { firebaseDb } from "./firebase-init";

    const db = firebaseDb || "mock";
    const employeeCol = new HotCollection(db, "items");
    employeeCol.add({ name: "John" });
    employeeCol.add({ name: "Jane" });

    const html = employeeCol.items.reduce((a, i) => a + `<p>${i.name}</p>`, "");
    document.getElementById("app").innerHTML = html;

> You can play with the example above [here](https://codesandbox.io/embed/hot-collection-1-8770l?fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark).

The problem with that approach is that reading and writing data in Firestore is an asynchronous exercise. If the data changes the UI will not update. Also, the `reduce` could be called before the HotCollection object load the documents from Firestore.

### Subscribing to Data Updates

A more reasonable solution is to subscribe to data updates. HotCollection instances expose the `subscribe` method. You pass a callback function to that method and it will be invoked every time the data changes. 

The callback function will receive the array of documents as first and only argument. Let's rewrite our example.

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

> The example above is available [here](https://codesandbox.io/embed/hot-collection-sub-5lux1?fontsize=14&hidenavigation=1&theme=dark).

Cool! But what really is inside that parameter the subscription passes when published?

### What is an Item?

HotCollection items property and the argument passed to subscriptions callbacks are pretty much the copies of the original documents inside the Firestore collection with few differences.

HotCollection will inject inside every item the Firestore document key as an `id` property. So, if you use id as a field in any collection things will break.

Also the object will not load any sub-collection subordinated to those documents.

## Manipulating Data

HotCollection provides three methods to manipulate Firestore documents: `add`, `set` and `del`.

### Adding and Editing Data

To add a document just pass an object to the HotCollection object `add` method. An automatic id will be provided by Firestore. Bellow we vape tiny app to add employees to a Firestore collection.

    import HotCollection from "@joaomelo/hot-collection";
    import { firebaseDb } from "./firebase-init";

    const get = id => document.getElementById(id);

    const db = firebaseDb || "mock";
    const employeeCol = new HotCollection(db, "employees");

    const renderEmployee = e => `
      <div class="card w-75 mb-1 mx-auto">
        <div class="card-body"/>
          <h5 class="card-title">Id: ${e.id}</h5>
          <p class="card-text">Name: ${e.name}</p>
          <p class="card-text">Dpto: ${e.dpto}</p>
        </div>
      </div>`;
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

If the id exists in the database collection all data will be replaced by the one you provided, if none is found the data will be inserted associated with the id value.

    // import and initialize firestore in db const
    import HotCollection from '@joaomelo/hot-collection';
    
    const container = document.querySelect('#container')

    const employeeCollection = new HotCollection(db, 'employeeCollection');
    employeeCollection.subscribe(employees => {
      employees.forEach(employee => {
          container.innerHtml = '';
          container.appendChild(`<input class="${employee.id}">${employee.name}</input>`);
          container.appendChild(`<button class="${employee.id}">update</input>`);
        })
    });

## Wrapping up

Ending message recapitulating usage. Maybe inform about pitfalls or trade-offs involving the library usage.

# Security Concerns

Never trust client code. It is very easy to wrap clients requests with malicious code to do all kind of nasty stuff with your database. The default approach to protect you database with FIrestore is with security rules. There are a lot of documentation on how to make them and adeher to best pratices. Some useful links bellow:

- Site oficial
- Serie de video
- Firebase IO é muito fácil

# Limitations

## Subcollections

Dos not know how to handle subcollections. The only one created is version. If savemode is turned d=to default and document is deleted, if a doument is deleted, firestore behaviour is to delete all document data but preserve the subcollection in it interity. 

## Joins

One of the more dificult thing to do in client code with firebase is the relational join of two collections.  I am working on that, but most of the solutions are based on serber code. Thos firebase io video explain a solution using Angular and RXjs you can learn from now. I am hoping to provide a solution for this in future version of hot-collection.

# Testing and Demo

If available, inform how to clone and install the package. Also instruction to run the demo and tests. If involved in the process, describe how environment variables are injected.

# License

Made by [João Melo](https://www.linkedin.com/in/joaomelo81/?locale=en_US) and licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details