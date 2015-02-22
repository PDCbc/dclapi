DCLApi
------

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