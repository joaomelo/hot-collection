# Hot-Collection

Hot-Collection is a javascript library that abstracts database's collections of documents in simple to use objects. Those collection objects automatically load data when it changes in the database, exposes CRUD actions as methods and offers complimentary features like data versioning and transformations. Hot-Collection supports In-Memory, Local Storage, Firestore and Airtable connections.

## Motivation

As an independent solo developer, I find myself somewhat obsessed with solutions that reduce the amount of repeated code I have do produce. 

In this regard [Firestore](https://firebase.google.com/products/firestore), [Airtable](https://airtable.com/) and [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) are awesome tools. They are fast, reliable, well documented and easy to use. Even so, since they are designed for a broad spectrum of use cases, the need to duplicate code to manage data between web apps is not uncommon.

This library tries to encapsulate some of that replication in a single reusable class. The goal is to help fellow developers focus more on business and less on technology.

# Usage

The library exports the `HotCollection` class. Its instances are capable to manage collections with methods to read and manipulate items inside those collections.

In a nutshell, you create HotCollection objects passing an adapter to its constructor that points to the chosen database technology and linked collection name. 

After that, you listen to updates by providing observer functions to the `subscribe` method and manipulate collection's documents with `add`, `set` and `del` methods.

Let us explore that in more detail.

## Getting Started

Install with npm.

    npm install @joaomelo/hot-collection

The first step is to import and instantiate a HotCollection object. The only required parameter is the collection name. Let's see.

    import HotCollection from '@joaomelo/hot-collection';
    itemsCollection = new HotCollection('items')

The `itemsCollection` methods will now expose features for reading and writing data in an very simple in-memory database. But you can also create collections linked to localStorage, airtable and firebase by passing adapters in second parameter. Next section explains that in detail.

## Adapters

### In-memory

This is the default adapter, you can even omit it if no other option is needed. Please keep in mind that i'm calling it a database with very big quotation marks around it, because it's really just a fancy javascript Map object.

To create a new HotCollection instance to manage employee data with the in-memory database, you set the value of the adapter property in the option object to `'in-memory'`, like this:

    const employeeCollection = new HotCollection('employees', { adapter: 'in-memory' });
    const otherEmployeeCollection = new HotCollection('employees'); // this works too

Be aware the all data will be erased even between page reloads. This is probably only useful for rapid prototyping, testing or experimenting with the library.

### Local Storage

Local storage is one type of [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). It holds data in the user browser associated with the app address.

To create a HotCollection instance linked to local storage we use an adapter object inside the options parameter. You set a `localStorage` property passing the reference to the local storage object as value. Like that:

    const adapter = { 
      localStorage: window.localStorage 
    };
    const employeeCollection = new HotCollection('employees', { adapter });

Client storages have limited security and are unable to sync between devices. But local storage can be useful for off-line use cases or a way to cut time and cost to reach some development milestone. For example, in early stages of your app, when you still didn't implemented plans quotas or user data limits you can raise the app in production tied to local storage for demo purposes.

### Airtable

Airtable is a productivity app that works like a super powered excel spreadsheet. You can check its tons of features in the [app site](https://airtable.com/). Airtable exposes an API to read and write to databases' tables. To link a HotCollection instance to an Airtable table, you provide a reference to the desired Airtable's base as an `airtable` property inside the adapter. See:

    import Airtable from 'airtable';
    import HotCollection from '@joaomelo/hot-collection';

    const apiKey = 'foobar';
    const baseId = 'foobar';
    const airtable = new Airtable({ apiKey });
    const adapter = { 
      airtable: airtable.base(baseId)
    };

    employeesCollection = new HotCollection('employees', { adapter })

Notice you will need an Airtable package for that. The [github website](https://github.com/Airtable/airtable.js) has details about installing and using the library. 

You must be aware the Airtable API is somewhat limited. It does not provide a way to receive notifications when data changes in the server. To approximate the experience to real time data, HotCollection will load the table on creation and after every write operation. 

### Firestore

Firestore is a awesome google product, part of the Firebase suite service. It is a document based database very feature rich. To create a HotCollection instance linked to a Firestore's collection server you pass the Firestore instance in a `firestore` property inside the `adapter`. See bellow:

    import * as firebase from 'firebase/app';
    import 'firebase/firestore';
    import HotCollection from '@joaomelo/hot-collection';

    const fireApp = firebase.initializeApp({
      // config data
    });

    const adapter = {
      firestore: fireapp.firestore()
    };
    employeesCollection = new HotCollection('employees', { adapter })

Even Firestore been the only true database technology currently supported by HotCollection, you should never trust client-side code. It is very easy to inject client's requests with malicious instructions to do all kinds of nasty things with your database. 

Fortunately, Firestore has a security rules feature that allows you to guard the database. There is a lot of content on how to use them and adhere to the best practices. Tp start, you can look at the official docs in [Get started with Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started) and also check this great Fireship guy talking about [How to Hack a Firebase App](https://www.youtube.com/watch?v=b7PUm7LmAOw).

## Reading Data

HotCollection offers a `subscribe` method to read data and listen to data updates. 

To start receiving data you call `subscribe` passing an observer function as argument. All observers will receive a snapshot immediately after subscription and at every data update signal subsequently. 

The observer function receives an array of items as its first and only argument. Bellow we have an example for listing employees:

    import HotCollection from '@joaomelo/hot-collection';

    function renderListItems (el, adapter) {
      const employeeCollection = new HotCollection('employees', { adapter });
      employeeCollection.subscribe(employees => {
        el.innerHTML = employees.length <= 0
          ? '<p>no employees found</p>'
          : `<ul>${employees.reduce((a, e) => a + `<li>${e.id}: ${e.name}</li>`, '')}</ul>`;
      });
    }

You can stop running a particular observer by calling the function returned from the subscribe method.

      const employeeCollection = new HotCollection('employees', { adapter });
      const unsub = employeeCollection.subscribe(employees => ... );
      unsub();

You can also call methods `getItem`, passing an id, and `getItems` to grab latest version retrieved of an item and items, respectively. This will not make a call to the database. Just make a synchronous read based on the last data read from the database.

Cool! But what is really inside that argument HotCollection passes to all observers?

### What is a Hot-Collection Item?

The items parameter passed to all observer functions is pretty much the copy of the original documents inside the database. But there are a few differences.

HotCollection will inject inside every item the corresponding document key and collection name as values for `id` and `collection` properties. Because of that, don't use those terms as fields in any collection or things will break.

You can also configure how HotCollection convert between the database docs to HotCollection items and vice-versa. But before that, let's discuss how to add, edit and delete data. 

## Manipulating Data

HotCollection provides three methods to manipulate database documents: `add`, `set` and `del`.

### Adding

To add a document just pass an item to the HotCollection `add` method. An automatic id will be provided  according to the database technology. Bellow, we write a function to add employees to a collection.

    import HotCollection from '@joaomelo/hot-collection';
    import { byId, resetAllTextInputs } from '../helpers';

    function renderAddItems (el, adapter) {
      const employeeCollection = new HotCollection('employees', { adapter });

      byId('btn-add-item').addEventListener('click', () => {
        employeeCollection.add({
          name: byId('ipt-add-item-name').value,
          dpto: byId('sel-add-item-dpto').value
        });
        resetAllTextInputs();
      });

      employeeCollection.subscribe(employees => {
        el.innerHTML = employees.length <= 0
          ? '<p>no employees found</p>'
          : `<ul>${employees.reduce((a, e) => a + `<li>${e.name}: ${e.dpto}</li>`, '')}</ul>`;
      });
    };

### Updating

We have two methods to update documents: `set` and `update`. Both receive an item as parameter. The item object must have an `id` property.

If a document with that `id` already exists in the database collection, all it's data will be replaced by what is inside the item parameter. If no document is found, a new one will be inserted associated with the id. The `update` method will not replace but merge data between the argument and the document in the database. The example bellow illustrates employee data editing with `set` and `update`.

    function renderSetItem (el, adapter) {
      const employeeCollection = new HotCollection('employees', { adapter });

      byId('btn-set-item-set').onclick = () => editEmployee(employeeCollection, 'set');
      byId('btn-set-item-update').onclick = () => editEmployee(employeeCollection, 'update');

      employeeCollection.subscribe(employees => {
        el.innerHTML = employees.length <= 0
          ? '<p>no employees found</p>'
          : `<ul>${employees.reduce((a, e) => a + `${renderListItem(e)}`, '')}</ul>`;

        query('.btn-set-item-edit').forEach(btn => {
          btn.onclick = () => {
            byId('ipt-set-item-id').value = btn.dataset.id;
            byId('ipt-set-item-name').value = btn.dataset.name;
          };
        });
      });
    };

    function renderListItem (e) {
      const btn = `<button data-id="${e.id}" data-name="${e.name}" class="btn-set-item-edit" type="button">Edit</button>`;
      const li = `<li>${e.name}:${e.dpto || 'no dpto'}${btn}</li>`;
      return li;
    };

    function editEmployee (collection, method) {
      const id = byId('ipt-set-item-id').value;
      const name = byId('ipt-set-item-name').value;

      if (!(id || name)) return;

      collection[method]({ id, name });
      resetAllTextInputs();
    }

### Deleting

To delete a document just call the `del` method in any HotCollection object. The only parameter is the document id. With few lines, we can implement a delete feature. See below.

    function renderDelItem (el, adapter) {
      const employeeCollection = new HotCollection('employees', { adapter });

      employeeCollection.subscribe(employees => {
        el.innerHTML = employees.length <= 0
          ? '<p>no employees found</p>'
          : `<ul>${employees.reduce((a, e) => a + `${renderListItem(e)}`, '')}</ul>`;
        query('.btn-del-item-del').forEach(btn => { btn.onclick = () => employeeCollection.del(btn.dataset.id); });
      });
    };

    function renderListItem (e) {
      const btn = `<button data-id="${e.id}" class="btn-del-item-del" type="button">Del</button>`;
      const li = `<li>${e.name}:${e.dpto || 'no dpto'}${btn}</li>`;
      return li;
    };

Just like that, we have a simple CRUD app syncing with a database. Sweet! But before wrapping up, let us talk about a few more optional configurations and some concerns you should take care of.

## Options

Until now we only used the adapter property of the options object. But you can direct the HotCollection behavior in more ways. Below we expand all the options properties. In the following subsections we discuss each one.

    options = { 
      adapter: 'in-memory',
      saveMode: 'safe',
      converters: {
        fromItemToDoc: someFunction,
        fromDocToItem: otherFunction
      },
      query: { ... },
    }

Let's talk about those options.

### Versions to the rescue

The property `saveMode` accepts one of two string values: `'default'` or `'safe'`. Until here, this text described the default way. When set to `'safe'` an interesting behavior is activated.

In safe mode, every time a document is added or edited, a JSON copy of it will be saved in a `versions` collection. HotCollection will also insert the moment that document was modified. The document in the `versions` will have the native id and also the `modified`, `operation`, `source` and `data` fields.

> if you are using Airtable, make sure to create a `versions` table with those fields beforehand.

HotCollection will not pull or do other operations with that `versions` collection, but you can consult the native interfaces to check on that. You can use another HotCollection to pull the versions data, but be careful since that can result in a infinite loop behavior.

Another difference in safe mode is that when `del` method is called. Instead of deleting the document for good, `deleted` field with the value `true` will be applied to the target document.

So, deleted documents will still be available in the HotCollection. But, since the `items` parameter passed to subscriptions are arrays, you can take advantage of array functions to filter out deleted items. Or more exciting, you could let the user choose when to show or hide deleted objects. 

### Converting Docs and Items

Converter is option object with two functions applied to every item or doc, respectively, before passing them to the app code or database. They are useful if your data structure does not match how you use it in the business and UI layers.

The function assigned to `fromItemToDoc` property will be called before adding or editing data to the database. The `fromDocToItem` counterpart will be called before returning the database document to the HotCollection items array. Both functions receive an object as parameter and return another object as the transformed data.

### Querying

In-memory and localStorage are very simple data structures and most type of collection filtering and ordering can be done applying array functions like `filter` and `map`. But Airtable and Firestore offer this kind of feature directly from their servers. This can be useful, for performance and security reasons. Even so, they operate with differently approaches.

To deal with that HotCollection that use Airtable and Firestore adapters will support a query object inside properties that will be applied to read requests to the backend. What is inside the query object differs from both adapters. I will explain both.

#### Airtable

In any Airtable database there is a help link in the top right corner. There you can access the API excellent help documentation. In the list records sections, you can check the detail of all the reading options: `fields`, `filterByFormula`, `maxRecords`, `pageSize`, `sort`, `view`, `cellFormat`, `timeZone` and `userLocale`.

You treat the HotCollection query object as a holder of these Airtable options. They will be passed as is to the Airtable's select `method`.

#### Firebase

Firestore applies reading configurations in a different way, basically chaining different methods over a query reference object. You can learn a lot reading this [guide](https://firebase.google.com/docs/firestore/query-data/queries).

HotCollection will support `where`, `orderBy` and `limit` options. To use them you pass properties with the same names inside the query options' property.

The `orderBy` property must be an object with `field` and `sort` properties. The `field` will take a string corresponding to a field name in the collection and `sort` property hold `'desc'` or `'asc'` values.

Together with ordering you can limit the number of retrieved documents using the `limit` property. It accepts an integer as the max number of records to retrieve.

The `where` value must be an array with one or more objects. Every object in the array must have three properties with string values: `field`, `operator` and `value`.

Be aware, one of the tradeoffs for Firestore efforts to improve performance is querying limitations. Filters operators could be considered few and some can be used only once. Read the guided i reference above and other official docs for details. 

That's enough of the good stuff, now we talk about boring things.

# Package Limitations

This package is very simple in its nature and has tons of limitations. I want to make clear two of them related to Firestore that could be a deal-breaker to you.

## Subcollections

HotCollection does not handle Firestore subcollections at all. It can't load or manipulate them. Not as first-level collections or as properties inside high-level items.

Some goals that nudge people to use subcollections could be achieved with array and map fields. Maybe you want to look more into [those options](https://firebase.google.com/docs/firestore/manage-data/data-types).

## Joins

One of the more difficult things to do in client code with Firestore is what would be the equivalent to traditional relational joins of two tables. HotCollection does not support create objects with union data between two or more collections.

You could do that inside your app code. Most of the solutions I found were based on server logic built upon [Cloud Functions](https://firebase.google.com/docs/functions). The Fireship website made a [video](https://fireship.io/lessons/firestore-joins-similar-to-sql/) explaining a solution based on Angular and RxJS, you can expand upon that.

# Demo

This repo has the package code inside the lib folder and also a demo folder with a example web app. You can use it to learn or explore the library.

To run the demo you first have to clone the repo.

    git clone https://github.com/joaomelo/hot-collection.git

If you want to connect to Firestore or Airtable, then create a `demo.env` file inside the `demo/config` folder. Fill that file with the variables assignments bellow. To access Firestore replace the values starting with `FIREBASE` with the real ones for your firebase project and of an active Firebase user email and password. To get Airtable working, write both api key and base id.

    FIREBASE_API_KEY=foobar
    FIREBASE_AUTH_DOMAIN=foobar.firebaseapp.com
    FIREBASE_DATABASE_URL=https://foobar.firebaseio.com
    FIREBASE_PROJECT_ID=foobar
    FIREBASE_STORAGE_BUCKET=foobar.appspot.com
    FIREBASE_MSG_SENDER_ID=foobar
    FIREBASE_APP_ID=1:foobar
    FIREBASE_USER=user@user.us
    FIREBASE_PASS=password
    AIRTABLE_API_KEY=foobar
    AIRTABLE_BASE_ID=foobar

Don't forget to add the `demo.env` file to your `.gitignore` list. All this data should be private.

The demo is able to run with just Firebase or Airtable config. It will work even without any environment data. The app will enable the availability of adapters in the examples accordingly.

Now install the dependencies and run the start script:

    npm install
    npm start

Have fun 🎉.

# Wrapping up

That was a lot. If you are still here, thank you for your attention. I have a daytime job, a wife and three wonderful children to take care of. So I give my love to coding at late nights and weekends. I appreciate your interest and feedback.

# License

Made by [João Melo](https://www.linkedin.com/in/joaomelo81/?locale=en_US) and licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.