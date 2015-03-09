DCLApi
------

Setup
-----

Install dependencies:

 * SQLite

 * Node.js & NPM

Install required node modules:
```
cd $PROJECT_DIRECTORY
npm install
```

Run tests:
```
npm test
```

Run the application:
```
npm start
```

Data
----

The data is not included in this repository, but the scripts used to acquire it are.

### Acquiring DIN to ATC Data

The Drugref database is used.  The MySQL database can be dumped using the 
```scripts/drugrefdump.sh``` script.  The dump file can be converted to SQLite
using the ```scripts/mysqldump2sqlite.sh``` script.

### Acquiring ATC Description Data

The original data comes from the file rrf/RXNCONSO.RRF in
http://download.nlm.nih.gov/umls/kss/rxnorm/RxNorm_full_02022015.zip at
http://www.nlm.nih.gov/research/umls/rxnorm/docs/rxnormfiles.html. 
You need to register to access that zip file which is quite large, 217MB expanding 
to 1.7GB, but mostly consists of data we don't need.

The ```scripts/concepts_export_all.sql``` SQL script can be used to export the 
necessary data from the RxNorm file rrf/RXNCONSO.RRF.  This generates a '|'
separated file which can be loaded into an SQLite database using the 
```scripts/loadAtcData.js``` script.  To keep all of the data in one database,
you should load it into the database created from the drugref dump above.


Spec
----

Drug API Spec

Technology — ideally a Node JS component that provides ...

REST API

############################################################################################################

— should be doable with public data sources

/classbydin/

takes an 8­ character din code — pads beginning with zeros to 8 characters — returns JSON

{“DIN”:”provided DIN code padded”, “class”:”string name of the class of the drug identified by the DIN code”}

############################################################################################################

—RXNav provides this service already

/classbyatc/

takes an 3+ character ATC code and returns JSON

{“ATC”:”provided ATC code”,”class”:”string name of the class of the drug identified by the first three characters of the provided atc code”}

http://rxnav.nlm.nih.gov/REST/rxclass/class/byId.json?classId=B01AA

############################################################################################################

— this is likely impossible without a subscription, but having the framework in place to do this is highly desirable

/classbyfddb/

takes an FDDB code and returns JSON

{“FDDB”:”provided FDDB code ­ padded if apropriate”, class:“string name of the class of the drug identified by the FDDB code”}

############################################################################################################