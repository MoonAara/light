var Class = require("./class"),
    Database = require("../server/database");

Dictionary = module.exports = Class(function() {
    var T = this;
    T.db = new Database(/*connection info*/);
},{
    register: function(phrase) {
        var T = this;
        return T.parse(0, phrase); 
    },
    lookup: function(codephrase, opts) {
        var T = this,
            code = T.dict.parsecode(codephrase),
            getter = (code === -1) ? "get" : "find";
        return T.db[getter](codephrase, opts);
    },

    ////////////////////////////////
    // private functions
    ////////////////////////////////

    // takes an entrycode that defines a specific entry
    // and a phrase to be parsed
    //
    // this will increment the count of any entry
    // this phrase contains 
    //
    // if the phrase already exists in the dictionary, 
    // this returns the entry;
    // otherwise, creates a new entry 
    parse: function(entrycode, phrase) {
        var T = this,
            branch = phrase[0],
            branchcode = T.db.get(entrycode, {
                branch: branch
            });
        if(phrase.length == 0) {
            return T.entries.retrieve(entrycode);
        } else if(branchcode) {
            return T.parse(branchcode, phrase.slice(1);
        } else {
            var last_letter = phrase[phrase.length-1];
            return T.entries.branch(code, last_letter);
        }
    },

    // create a new branch in our dictionary
    // off of the entry specified by 'code'
    // with the 'letter' identifying the branch
    branch: function(rootcode, letter) {
        var T = this,
            rootentry = T.retrieve(rootcode, "branches"),
            entry = {
                root: rootentry, 
                letter;
            };
        
        T.db.store(entry, function(result) {
            rootupdate = {
                branches: rootentry.branches[letter].push(result.id), 
            },
            T.db.update(rootentry, root);
        });    
    },

    // retrieves the entry for a 'code'
    //
    // if a 'branch' letter is provided
    // we retrieve the entry it points to
    retrieve: function(code, branch) {
        var T = this,
            entry = T.db.get(code);
        while(entry.exists()) {
            T.db.use(entry);
            entry = entry.root();
        }
    },
    
    // returns the code of the entry 
    // that splits with 'branch' letter
    // from parent specified by 'code'
    getcode: function(code, branch) {
        var T = this,
            entry = T.retrieve(code),
            branchcode = entry.branches[branch];    

        if(branchcode) {
            T.db.tap(branchcode);
            return brancode;
        }
    },

    // returns a code as an integer,
    // returns -1 if it cannot be parsed 
    parsecode: function(codephrase) {
            for(var i = 0, l = codephrase.length; i < l; i++) {
                var n = codephrase[i];
                if(isNan(n)) {
                    return -1;
                }
            };
            return parseInt(codephrase);
    },

});
