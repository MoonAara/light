var Class = require("../common/class"),
    async = require("async"),
    List = require("../common/list");

Database = module.exports = Class(function(rootid) {
    var T = this;

    T.idtracker = 0;

    T.map = {};
    T.lettermap = {};

    T.init();
},{

    get: function(id, opts) {
        var T = this,
            entry = T.map[id];

        if(opts.branch) {
            entry = entry.branches[opts.branch];
        }

        T.tap(entry.id);

        // TODO make database calls according to opts.fields
        return { id: entry.id };
    },
    store: function(entry) {
        var T = this;

        // TODO check for redundant entries,
        // most complex part of this codebase

        var id = T.newid(); 
        T.map[T.newid()] = entry;
    },
    update: function(id, values, fields) {
        var T = this,
            entry = T.idlookup[id];

        for(field in values) {
            entry[field] = values[field];
        }

        return fields ? T.filter(entry, fields) : entry;
    },


    // get an entry based on info
    //
    // letter: *required* parameter, 
    //  will find entry based on branch 
    //  specified by this letter in the 
    //  given context
    //
    // root: id of an entry, if provided 
    //  letter specifies a branch within 
    //  this entry
    lookup: function(info) {
        var T = this, 
            entry;
        
        if(opts.root) {
            var root = T.get(opts.root, {
                fields: opts.fields ? opts.fields + ",branches" : "branches",  
            });
            entry = root.branches[opts.letter];        
        } else {
            entry = T.lettermap[opts.letter];
        }
    
        return entry;
    },

    // find an entry by looking up a phrase
    // one letter at a time
    //
    // if the complete phrase does no specify
    // an existing entry, the last entry found
    // will be returned with 'exists' set to false
    //
    // opts include:
    //
    //  root: id of entry that acts as our starting point
    //
    //  fields: see 'fields' parameter of 'filter' method 
    //
    //  path: include a 'fields' string here to gather
    //      any entries we find on the way to the
    //      entry specified by the complete phrase
    //
    //  phrases: return entries for subphrases
    //      within the phrase we're parsing;
    //      provide any number of the following {
    //
    //      history: string containing what has already
    //          been searched, will be used to avoid
    //          beginning new paths with the same letter
    //          
    //      fields: see 'fields' parameter of 'filter' method 
    //          
    //      TODO groupby: comma-separated list of
    //          fields to group results by;
    //          will return a map for
    //          each of the 'groupby' fields
    //          mapping every unique value 
    //          to a list of entry ids
    //
    //      }
    find: function(phrase, opts) {
        
        if(phrase.length === 0) return {
            exists: false,   
        };
        
        // our goal is to answer:
        // is there a chain of letters that matches this phrase?

        // we take the following steps:
        //
        // 1) check if the first letter of the phrase
        //    matches a branch within the given context
        //
        // 2) continue (1) for each remaining letter 
        //    in the phrase, keeping track of each code 
        //
        // 3) if 'phrases' parameter is passed in opts,
        //    begin a new 'find' process on 
        //    each part of the phrase
        //    in order to gather subphrases

        var T = this,
            exists = true, 
            history = opts.history ? opts.history + firstletter : firstletter,
            lookupopts = _.extend(opts, {
                primary: true,
            }),
            subopts = _.extend(opts.phrases, {
                primary: false,
            }),
            lookups = [],
            root;
            // we'll compose a list of lookups that we can 
            // execute asyncronously 

        var process = function(letter) {
            
            root = entry.id;
            branch = entry.branches[letter];

            if(!branch) {
                exists = false;
            }

            if(opts.phrases) {
                // search for subphrases (see step 3 above)
                //
                // we recursively call 'find', 
                // passing values within 'opts'
                // to preserve context
                var subopts = {
                    root: root,
                    fields: opts.phrases.fields,
                    history: history,  
                    phrases: opts.phrases,
                    primary: false,
                },
                lookups.push({
                    letter: letter,
                    opts: subopts,
                });
                
            }

            history += letter;
            var lookupopts = _.extend(opts, {
                root: root,
                primary: true,    
            }),
            lookups.push([phrase[0], lookupopts]),
        };

        letters.forEach(process, function(letter) {
            process(letter);        
        });

        async.map(lookups, T.lookup, function(err, results) {
            console.log(err); // TODO error handling
            
            var result = {
                error: err,
                exists: exists,
            }, path = {},
            longest = 0;

            if(opts.phrases) {
                result.phrases = new Dictionary();
            }

            results.forEach(function(lookup) {
                T.tap(entry.id);
                if(result.primary) {
                    var len = result.phrase.length; 
                    longest = Math.max(len, longest);
                    if(len = phrase.length) {
                        result.complete = true;
                        result.entry = T.filter(lookup, opts.fields);
                    } else {
                        path[len] = T.filter(lookup, opts.path);
                    }
                    // in beg, take most
                } else {
                    // fields, path          
                }
            });
            result.phrases.extend(subresult);
        });

        if(result.complete) {
            T.use(result.entry.id)
        };

        if(opts.path) {
            result.path = {};
        }
        return returns; 
    },

    addbranch: function(lookup, letter) {
        var T = this,
            root = T.lookup(lookup, {
                fields: "text,branches",     
            }),
            entry = T.create({
                text: root.text + 'letter',
                root: root.id, 
            });

        T.update(root.id, {
            branches: root.branches.concat([{
                    
            }]);
        });
    },
    ////////////////////////////////
    // private functions
    ////////////////////////////////

    // pares an entry to include only the given fields
    //
    // if no 'fields' parameter is given, will only return
    // the 'id' of the entry
    // 
    // if 'fields' is "all", will return entire entry
    //
    // otherwise, 'fields' is a comma-separated list
    // naming the values we want from the entry
    filter: function(entry, fields) {
        if(!typeof fields === "string") {
            return {
                id: entry.id,
            };
        } else if(fields === "all") {
            return entry 
        } else {
            var T = this,
                returns = fields.split(','),
                result = {};

            returns.forEach(function(field) {
                result[field] = entry[field];
            });

            return result;
        }
    },
 
    // will increment the use count 
    // of this entry
    use: function(code) {
        var T = this,
            fields = "uses,root",
            entry = T.get(code, fields);

        while(entry.exists()) {
            T.db.update({
                code: entry.code,
                uses: entry.uses+1,    
            });
            entry = T.get(entry.root, fields);    
        }
    },

    // will increment the lookup count 
    // of this entry
    tap: function(id) {
        var T = this,
            fields = "lookups,root",
            entry = T.get(id, fields);

        while(entry.exists()) {
            T.db.update({
                id: entry.id,
                uses: entry.lookups+1,    
            });
            entry = T.get(entry.root, fields);    
        }
    },

   

    newid: function() {
        // temporary, will use author+document ids
        return this.idtracker++;
    },

    init = function() {
        var T = this,
            alphabet = "abcdefghijklmnopqrstuvwxyz";
        alphabet += alphabet.toUpperCase();
        alphabet += "0123456789.,;:?/<>[]{}()\"\'!@#$%^&*_-=+";
        
        characters.forEach(function(character) {
            T.lettermap[character] = { 
                id: T.newid(), 
            };
        }
    },
});
