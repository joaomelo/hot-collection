class MockRef {
  constructor (parent, { id, docData }) {
    this.parent = parent;
    this.id = id || randomId();
    this.docData = docData || {};
  }

  data () {
    return this.docData;
  }

  set (docData) {
    this.docData = docData;
    this.parent.publishUpdate();
  }

  delete () {
    this.parent.delete(this.id);
  }

  collection () {
    return {
      add (echo) {
        return echo;
      }
    };
  }
}

function randomId () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;

  let result = '';
  const arbitraryIdSize = 5;
  for (let i = 0; i < arbitraryIdSize; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { MockRef };
