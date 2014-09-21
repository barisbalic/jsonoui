# JSONOUI (J'son oui)

An overly simple API for retrieving the organisation registered to an
[OUI](http://en.wikipedia.org/wiki/Organizationally_unique_identifier).
You can perform the lookup by MAC address or OUI explicitly, both options expect
the [IEEE 802](http://standards.ieee.org/about/get/) human-friendly format. In
short that means only hyphens and colons may be used as separators.

This project should not be taken seriously, in part it provides API that saves
me from writing code to parse a text file repeatedly for some toy projects,
but mostly it seemed like an opportunity to write something comically 
under-designed, with an equally dumb name.

I was tempted to write a post about fully-fleshed out, architected, hosted,
services being some kind of anti-pattern, to troll some recent posts I've seen
about databases being an anti-pattern.  But I got bored in the process.


## Endpoints

### Ouis

`GET /ouis/00-00-1`

The OUI endpoint will accept a single parameter that represents the OUI you wish
to look up, individually or as part of a MAC address.  If the provided parameter
is invalid or the OUI cannot be found in the registry, you will receive a 404.

The properties are self-descriptive, but the `generated_at` field is extracted
from the file when it gets parsed, in the format it appears.

**Example**

```
GET http://jsonoui.com/ouis/00-00-01

HTTP/1.1 200(OK)
{
  "entry": {
    "organisation": "XEROX ORGANISATION",
    "generated_at": "Sun, 21 Sep 2014 05:00:02 -0400"
  },
  "meta": {
    "about": "http://jsonoui.com/about"
  }
}
```

### About

`GET /about`

This endpoint returns a description of the service and it's current state, it's
not something you should be hitting programmatically, so I won't describe it 
here.  The only property that needs explaining is the `db_size`, which refers to
the amount of memory taken up by the "DB" in bytes.

No example, just call it and see.

### Reload

`GET /reload`

This last endpoint lets you trigger a reload of the database, overwriting keys
as it goes.  Updates are available as soon as they are made, of course no
guarantees can be made about when an update might be made.

## Poor implementation

I know that there are several drawbacks to the choices I've made, but ignoring
these is kind of the point.  For example the fact that hundreds of
`/reload` requests might occur, doesn't matter, because NodeJS will only allow
five to execute at any given time, and that they will all always return the
latest updates.

## Contributing

I can't see why anyone would want to, but please feel free to throw some
pull requests this way.  I will probably reject anything that tries to
clean up the structure too much as the mess is part of the comedy.  But if
someone wanted to extract addresses for the organisations and return them
in responses, that would be fine.

## Licence

The MIT License (MIT)

Copyright (c) 2014 Baris Balic

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

