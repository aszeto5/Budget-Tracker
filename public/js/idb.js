let db;
// connection to IndexedDB database
const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;

  db.createObjectStore("new_transaction", { autoIncrement: true });
};

// when successful
request.onsuccess = function (event) {
  db = event.target.result;

  //if app is online run uploadTransaction to send local db data to api
  if (navigator.onLine) {
    uploadTransaction();
  }
};

request.onerror = function (event) {
  // error
  console.log(event.target.errorCode);
};

// open a new transaction with read and write permissions
function saveRecord(record) {
  const transaction = db.transaction(["new_transaction"], "readwrite");

  const transactionObjectStore = transaction.objectStore("new_transaction");

  transactionObjectStore.add(record);
}

// open a new transaction to the database to read the data
function uploadTransaction() {
  const transaction = db.transaction(["new_transaction"], "readwrite");

  const transactionObjectStore = transaction.objectStore("new_transaction");

  const getAll = transactionObjectStore.getAll();

  // when successful getAll function will run
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(["new_transaction"], "readwrite");

          const transactionObjectStore =
            transaction.objectStore("new_transaction");
          // clear all items
          transactionObjectStore.clear();

          alert("All saved transactions have been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// listen for when app comes back online
window.addEventListener("online", uploadTransaction);