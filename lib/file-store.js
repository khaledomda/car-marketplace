// JSON-file storage for running on your own server (not for Vercel).
const fs = require('node:fs');
const path = require('node:path');
const { computeStats } = require('./core');

function createFileStore(file) {
  const empty = () => ({ visits: [], searches: [], requests: [], ratings: [], termsAcceptances: [] });
  let db;
  try {
    db = { ...empty(), ...JSON.parse(fs.readFileSync(file, 'utf8')) };
  } catch {
    db = empty();
  }
  let timer = null;
  const save = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file + '.tmp', JSON.stringify(db, null, 2));
      fs.renameSync(file + '.tmp', file);
    }, 200);
  };
  const push = (key) => async (item) => {
    db[key].push(item);
    save();
  };
  return {
    addVisit: push('visits'),
    addSearch: push('searches'),
    addRequest: push('requests'),
    addTerms: push('termsAcceptances'),
    addRating: push('ratings'),
    async updateRequest(id, patch) {
      const item = db.requests.find((r) => r.id === id);
      if (!item) return null;
      Object.assign(item, patch);
      save();
      return item;
    },
    async stats() {
      return computeStats(db);
    },
    async dump() {
      return db;
    },
  };
}

module.exports = { createFileStore };
