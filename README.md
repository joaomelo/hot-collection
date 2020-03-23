THIS PACKAGE IS IN IT FINAL ADJUSTMENTS PHASE FOR FIRST FUNCTIONAL RELEASE. PLEASE, DOT NOT INSTALL IT RIGHT NOW. 

# Hot-Collection

Hot-Collection is javascript a package that abstracts Firestore collection in a feature rich object inside an web app. It automatically load data when it changes, exposes the basic data manipulation operations as methods and enrich the developer experience with features as data versioning and data adapters.

## Motivation

As an independent solo developer i find myself somewhat obsessed by solutions that reduce the amount of repeated code I have do produce. In this regard Firestore is awesome. It is fast, reliable, well documented and easy to use. Even so, since Firebase is designed for a broad spectrum of use cases, i see myself repeating some infrastructure code to manage data between web apps.

This package aims to encapsulate this approach in a single class of data management that can make a developer life easily when interacting with Firestore. The goal is to help fellow developers focus more on business and less in technology.

# Usage

The library provides a HotCollection class. When as instance is created it manages a Firestore collection adapted to the options provided. The class provides method to manipulate data and subscribe to data changes.

## Getting Started

Install with npm.

    npm install @joaomelo/hot-collection

The first step is to import and instantiate a HotCollection object. The required arguments are the Firestore reference and the collection name.

    import * as firebase from 'firebase/app';
    import 'firebase/firestore';
    import HotCollection from '@joaomelo/hot-collection';

    const fireApp = firebase.initializeApp({
      // config data
    });

    const db = fireapp.firestore();
    itemsCollection = new HotCollection(db, 'items')

`ItemCollection` will now expose features for reading and writing data in the Firestore `items` collection.

## Reading Data

Every data update in the Firestore collection will trigger a HotCollection object to update its data.

### Items Property

This data is exposed in the `items` property which returns an `array` with all the documents inside the collection. you could do something like this show all the values of a name field inside a people collection in Firestore.

    // import and initialize firestore in db const
    import HotCollection from '@joaomelo/hot-collection';
    
    const container = document.querySelect('#container')

    const peopleCollection = new HotCollection(db, 'people');
    peopleCollection.forEach(person => container.appendChild(`<p>${person.name}</p>`))

The problem with that approach is that reading and writing data in Firestore is an assyncronous operation. If the data changes the UI will not update and even if the internet is slow the `forEach` could be called before the hot collection object could load all the documents.

### Subscribing to Data Updates

A more reasonable solution is to subscribe to data updates. All HotCollection instances exposes the `subscribe` method. You pass a function to that mehots and the hot collection object will call it every time data changes passing the updated array of items as the callback parameter. Let's rewrite our example.

    // import and initialize firestore in db const
    import HotCollection from '@joaomelo/hot-collection';
    
    const container = document.querySelect('#container')

    const peopleCollection = new HotCollection(db, 'people');
    peopleCollection.subscribe(people => {
      people.forEach(person => {
          container.innerHtml = '';
          container.appendChild(`<p>${person.name}</p>`);
        })
    });

Cool! But what really is inside that parameter the subscription passes when triggered?

### What is an Item?

HotCollection items property and the parameter passed to subscriptions callbacks are pretty much the copies of the original documents inside the collection with few differences.

HotCollection will inject inside everyitemevery item the Firestore document key as an `id` property.

Also the object will not carry any sub collections subordinated to those documents.

## Manipulating Data

HotCollection provides three methods to manipulate documents in a Firestore collection. They are `add`, `set` and `del`.

### Adding and Editing Data

To add a document just pass an object to the HotCollection object `add` method. An automatic id will be provided by Firestore. 

    // import and initialize firestore in db const
    import HotCollection from '@joaomelo/hot-collection';
    
    const projects = new HotCollection(db, 'projects');    
    const newProject = {
      title: 'project X',
      description: 'A secret project'
    }
    projects.add(newProject);

If you want to alter an object or add it with a particular id, pass an object the set method but this time make sure there is an `id` property inside the object. If the id exists in the collection all data will be replaced by the one you provide

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