# Hot-Collection

Hot-Collection is a javascript library that abstracts database's collections of documents in simple to use objects. Those collection objects automatically load data when it changes in the database, exposes CRUD actions as methods and offers complimentary features like data versioning and transformations. Hot-Collection supports In-Memory, Local Storage, Firestore and Airtable connections.

## Motivation

As an independent solo developer, I find myself somewhat obsessed with solutions that reduce the amount of repeated code I have do produce. 

In this regard [Firestore](https://firebase.google.com/products/firestore), [Airtable](https://airtable.com/) and [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) are awesome tools. They are fast, reliable, well documented and easy to use. Even so, since they are designed for a broad spectrum of use cases, the need to duplicate code to manage data between web apps is not uncommon.

This library tries to encapsulate some of that replication in a single reusable class. The goal is to help fellow developers focus more on business and less on technology.

# Usage

The library exports the `HotCollection` class. Its instances are capable to manage collections with methods to read and manipulate items inside those collections.

In a nutshell, you create HotCollection objects passing to its constructor an adapter that points to the choosed database technology and the collection name. After that, you listen to updates by providing callbacks functions to the subscribe method and manipulate collection's documents by calling add, set and del methods.

Let explore that in more detail.

## Getting Started

Install with npm.

    npm install @joaomelo/hot-collection

The first step is to import and instantiate a HotCollection object. The only required parameter is the collection name. Let's see.

    import HotCollection from '@joaomelo/hot-collection';
    itemsCol = new HotCollection('items')

The `itemsCol` will now expose features for reading and writing data in an very simple in-memory data structure. It is very frugal and with limited use besides perhaps prototyping and testing.

But you can create collections tied with localStorage, airtable and firebase by passing adapters to the second  constructor parameter, called options. Let's explore that.

## Adapters

### In-memory

This is the default adapter, you can even omit it if no other option is passed. To explicit tell HotCollection to use the in-memory database. Please imagine that i'm calling it a database with very big quotation marks around it, because it's really just a fancy javascript Map object.

To create a new HotCollection instance to hold employee data with in-memory storage you set the value of the adapter property in the option object to `'in-memory'`, like this:

    const employeeCollection = new HotCollection('employees', { adapter: 'in-memory' });
    const otherEmployeeCollection = new HotCollection('employees'); // this works too

Be aware the all data will be erased even between page reloads. This is probably only useful for rapid prototyping apps, testing or experimenting with the library.

### Local Storage

Local storage is one type of [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). It holds data in the user browser associated with the app address.

To create a HotCollection instance linked to local storage you pass a reference to the local storage object to the localStorage property inside the adapter option. Like that:

    const adapter = { 
      localStorage: window.localStorage 
    };
    const employeeCollection = new HotCollection('employees', { adapter });

It has limited security (since all data is in the client) and is unable to sync between devices. But local storage can still be useful for off-line use cases or a way to cut time and cost to reach some development milestone. For example, in early stages of your app, when you still didn't implemented plans quotas or user data limits you can put the app in production tied to local storage for demo purposes.

### Airtable

Airtable is a productivity app that works like a super powered excel spreadsheet. You can check its tons of features in the (app site)[https://airtable.com/]. Airtable exposes an API to read and write to tables. To link a HotCollection instance to an airtable table you provide a reference to its base as an airtable property inside the adapter. See:

    import Airtable from 'airtable';
    import HotCollection from '@joaomelo/hot-collection';

    const apiKey = 'foobar';
    const baseId = 'foobar';
    const airtable = new Airtable({ apiKey });
    const adapter = { 
      airtable: airtable.base(baseId)
    };

    employeesCollection = new HotCollection('employess', { adapter })

Notice you will be using airtable package for that. Its (github website)[https://github.com/Airtable/airtable.js] has details about installing and using the library. 

You must be aware the Airtable API is somewhat limited. It does not provide a way to receive notifications  when data changes in the server. To approximate the experience to real time data, HotCollection will inefficiently load the table data every two seconds (i know... is due to improve). You can personalize the frequency by passing an `interval` property in the adapter with an integer value corresponding to the seconds interval to check. Be aware that Airtable imposes time limits to API calls to its servers. Let's check our code again:

    import Airtable from 'airtable';
    import HotCollection from '@joaomelo/hot-collection';

    const apiKey = 'foobar';
    const baseId = 'foobar';
    const airtable = new Airtable({ apiKey });
    const adapter = { 
      airtable: airtable.base(baseId),
      interval: 30 // seconds
    };

    employeesCollection = new HotCollection('employess', { adapter })

### Firestore

Firestore is a awesome google product part of the Firebase service. It is a document storage database very feature rich. To create an HotCollection instance linked to tome collection in Firestore server you pass the firestore instance inside the adapter. See bellow:

    import * as firebase from 'firebase/app';
    import 'firebase/firestore';
    import HotCollection from '@joaomelo/hot-collection';

    const fireApp = firebase.initializeApp({
      // config data
    });

    const adapter = {
      firestore: fireapp.firestore()
    };
    employeesCollection = new HotCollection('employess', { adapter })

Even Firestore been the only true database technology currently supported by HotCollection, you should never trust client-side code. It is very easy to inject clients' requests with malicious instructions to do all kinds of nasty things with your database. 

Fortunately, Firestore has a security rules feature that allows you to guard the database. There is a lot of content on how to use them and adhere to the best practices. You can look at the official docs in [Get started with Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started) and also check this great Fireship guy talking about [How to Hack a Firebase App](https://www.youtube.com/watch?v=b7PUm7LmAOw).

## Reading Data

HotCollection offers a `subscribe` method to read data and listen to data updates. You pass a observer function to the subscribe method and that function will be invoked immediately passing the latest data snapshot and at every data update signal coming from the database. 

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

Cool! But what is really inside that argument the subscription passes to all observers?

### What is a Hot-Collection Item?

The items parameter passed to all observer functions is pretty much the copy of the original documents collection inside the database. But there are a few differences.

HotCollection will inject inside every item the document key and its collection name as the values of `id` and `collection` properties. So, don't use those terms as fields in any collection or things will break.

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

If a document with that `id` already exists in the database collection all it's data will be replaced by what is inside the item parameter. If no document is found, a new one will be inserted associated with the id. Let's update the last example with the editing capability.

    function renderSetItem (el, adapter) {
      const employeeCollection = new HotCollection('employees', { adapter });
      byId('btn-set-item-set').onclick = () => editEmployee(employeeCollection, 'set');
      byId('btn-set-item-update').onclick = () => editEmployee(employeeCollection, 'update');

      employeeCollection.subscribe(employees => {
        el.innerHTML = employees.length <= 0
          ? '<p>no employees found</p>'
          : `<ul>${employees.reduce((a, e) => a + `${renderListItem(e)}`, '')}</ul>`;
        query('.btn-set-item-edit').forEach(btn => { btn.onclick = loadItem; });
      });
    };

    function renderListItem (e) {
      const btn = `<button data-id="${e.id}" data-name="${e.name}" class="btn-set-item-edit" type="button">Edit</button>`;
      return `<li>${e.name}:${e.dpto || 'no dpto'}${btn}</li>`;
    };

    function editEmployee (collection, method) {
      const id = byId('ipt-set-item-id').value;
      const name = byId('ipt-set-item-name').value;

      if (!(id || name)) return;

      collection[method]({ id, name });
      resetAllTextInputs();
    }

    function loadItem () {
      byId('ipt-set-item-id').value = this.dataset.id;
      byId('ipt-set-item-name').value = this.dataset.name;
    }

### Deleting

To delete a document just call the `del` method in any HotCollection object. The only parameter is the document id. With few lines, we can implement a delete feature. See below.

    import HotCollection from '__lib'; // '@joaomelo/hot-collection';
    import { db } from '../services';
    import { query } from '../helpers';
    import { renderEmployees } from './common';

    const employeeCol = new HotCollection(db, 'employees');

    export function renderDelExample (el) {
      employeeCol.subscribe(items => {
        el.innerHTML = renderEmployees(items, 'del');
        query('.del-delbtn').forEach(btn => { btn.onclick = delEmployee; });
      });
    };

    function delEmployee () {
      employeeCol.del(this.dataset.id);
    }

Just like that, we have a simple CRUD app syncing with a central database. Sweet! But before wrapping up, let us talk about a few more optional configurations and some concerns you should take care of.

## Options

HotCollection constructor has a third optional parameter for options. Below we have a hypothetical use case taking advantage of all the parameters.

    import HotCollection from "@joaomelo/hot-collection";
    
    // proper imports and initializations

    options = { 
      saveMode: 'safe'
      adapters: {
        itemToDoc: someFunction,
        docToItem: otherFunction,
      },
      where: [
        {
          field: 'fieldName',
          operator: '==' // or some Firestore operator
          value: 'someValue'
        },
        {
          field: 'otherFieldName',
          operator: '==' // or some Firestore operator
          value: 'someOtherValue'
        }
      ]
      orderBy: 'someFieldName',
    }

    const collection = new HotCollection(db, "employees", options);

Let's talk about those options.

### Versions to the rescue

The property `saveMode` accepts one of two string values: `'default'` or `'safe'`. Until here, this README describes the default way. When set to `'safe'` an interesting behavior is activated.

In safe mode, every time a document is added or set, a copy of it will be saved in a `versions` subcollection inside the same document. HotCollection will also insert the moment that document was modified and (if available), the id and email of the Firebase user who made the operation.

HotCollection will not pull or do other operations with that `versions` subcollection. If you want, you can consult the admin Firestore interface or access the subcollection with the native API.

Another difference in safe mode is when `del` method is called. Instead of deleting the document in Firestore, `deleted` field with the value `true` will be applied to the target document.

So, deleted documents will still be available in the HotCollection. Since the `items` parameter passed to subscriptions and the promised return of `getItems` are arrays, you can take advantage of array functions like this:

    myHotCollection.getItems().filter(i => !i.deleted)

Or more exciting, you could let the user choose when to show or hide deleted objects. 

### Adapters

Adapters are functions applied to every item or doc before passing them to the next step. They are useful if your data structure does not represent how you use it in the business and UI layers.

Both functions receive an object as parameter and return another object as the transformed data.

The function assigned to `itemToDoc` property will be called before adding and setting data to the database. The `docToItem` counterpart will be called before returning the database document to the HotCollection items array.

### Ordering

The `orderBy` property takes a string corresponding to a field name in the collection. This will be used to order the items' property inside the HotCollection. Yeah! That simple.

### Fullstack Query

As said before, since the HotCollection `items` is an array, you can do fancy stuff with arrays functions. One of them is filter items. Let's explore simple logic to filter employees by name.

    import HotCollection from '@joaomelo/hot-collection';
    import { db } from '../services';
    import { byId } from '../helpers';
    import { renderEmployees } from './common';

    let employees, filterEl;

    export function renderFilterClientExample (el) {
      filterEl = el;
      const employeeCol = new HotCollection(db, 'employees');
      employeeCol.subscribe(items => {
        employees = items;
        update();
      });

      byId('cli-filter').addEventListener('click', update);
    };

    function update () {
      const filterText = byId('cli-name').value;
      const filterEmployees = filterText === '' ? employees : employees.filter(i => i.name.includes(filterText));
      filterEl.innerHTML = renderEmployees(filterEmployees, 'add');
    }

But sometimes, for performance or security reasons you need to filter at the backend. No problem, we have the `where` options.

The `where` value must be an array with one or more objects. Every object in the array must have three properties with string values: `field`, `operator` and `value`. 

These where clauses will be applied to the collection using the Firestore `where` method. The HotCollection content of that instance won't be the whole collection anymore, but the result of the applied filters.

Be aware, one of the tradeoffs for Firestore efforts to improve performance is querying limitations. Filters operators could be considered few and some can be used only once. 

The documentation on querying Firestore data is excellent, you can read the [guide here](https://firebase.google.com/docs/firestore/query-data/queries). HotCollection will mirror this behavior. 

That's enough of the good stuff, now we talk about boring things.

# Package Limitations

This package is very simple in its nature and has tons of limitations. But I want to make clear two of them. They could be a deal-breaker to you.

## Subcollections

HotCollection does not handle subcollections at all. It can't load or manipulate them. Not as first-level collections or as properties inside high-level items.

Some goals that make people use subcollections could be achieved with array and map fields. Maybe you want to look more into [those options](https://firebase.google.com/docs/firestore/manage-data/data-types).

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