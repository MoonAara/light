This is how we encode documents.

12-2|34-223123 2-1|2-4|7-5  52-2 43-1231234|2-1|33-23531
    ^         ^           ^^     ==========-------------
    |         |           |            ||    |
   this does not take up actual space  ||    |
              |           |            || each of these
           that is one null byte       || is a paragraph
                          |            ||
   more null bytes means lower level headers
                                       ||
                                each of these is a phrase                                                           
