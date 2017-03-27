## Classes

<dl>
<dt><a href="#lowkie">lowkie</a></dt>
<dd></dd>
<dt><a href="#ObjectId">ObjectId</a></dt>
<dd></dd>
<dt><a href="#lowkieSchema">lowkieSchema</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#connect">connect([dbpath], [options])</a> ⇒ <code>Promise</code></dt>
<dd><p>connects lowkie to lokijs</p>
</dd>
<dt><a href="#handler">handler()</a> ⇒ <code>object</code></dt>
<dd><p>this is the proxy handler for lowkie, provides access to native loki methods as well.</p>
</dd>
<dt><a href="#model">model(model, Schema)</a> ⇒</dt>
<dd><p>lowkie model proxy for lokijs collection</p>
</dd>
</dl>

<a name="lowkie"></a>

## lowkie
**Kind**: global class  

* [lowkie](#lowkie)
    * [new lowkie()](#new_lowkie_new)
    * _instance_
        * [.Schema(scheme)](#lowkie+Schema) ⇒
    * _static_
        * [.lowkie](#lowkie.lowkie)
            * [new lowkie([options])](#new_lowkie.lowkie_new)

<a name="new_lowkie_new"></a>

### new lowkie()
lowkie ORM singleton class

<a name="lowkie+Schema"></a>

### lowkie.Schema(scheme) ⇒
creates lowkie schema, also includes helpers for document validations

**Kind**: instance method of <code>[lowkie](#lowkie)</code>  
**Returns**: instance of lowkieSchema  

| Param | Type |
| --- | --- |
| scheme | <code>object</code> | 

<a name="lowkie.lowkie"></a>

### lowkie.lowkie
**Kind**: static class of <code>[lowkie](#lowkie)</code>  
<a name="new_lowkie.lowkie_new"></a>

#### new lowkie([options])
Creates an instance of lowkie.


| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>any</code> | <code>{}</code> | 

<a name="ObjectId"></a>

## ObjectId
**Kind**: global class  

* [ObjectId](#ObjectId)
    * [new ObjectId()](#new_ObjectId_new)
    * [.createId()](#ObjectId.createId)

<a name="new_ObjectId_new"></a>

### new ObjectId()
helper class for generating Ids

<a name="ObjectId.createId"></a>

### ObjectId.createId()
generates a unique ID

**Kind**: static method of <code>[ObjectId](#ObjectId)</code>  
<a name="lowkieSchema"></a>

## lowkieSchema
**Kind**: global class  

* [lowkieSchema](#lowkieSchema)
    * [new lowkieSchema()](#new_lowkieSchema_new)
    * _instance_
        * [.createDocument(doc)](#lowkieSchema+createDocument) ⇒
        * [.insert(options)](#lowkieSchema+insert) ⇒
    * _static_
        * [.Types](#lowkieSchema.Types)

<a name="new_lowkieSchema_new"></a>

### new lowkieSchema()
proxy for creating new loki documents

<a name="lowkieSchema+createDocument"></a>

### lowkieSchema.createDocument(doc) ⇒
returns validated document for lokijs

**Kind**: instance method of <code>[lowkieSchema](#lowkieSchema)</code>  
**Returns**: object  

| Param | Type |
| --- | --- |
| doc | <code>any</code> | 

<a name="lowkieSchema+insert"></a>

### lowkieSchema.insert(options) ⇒
overwrites the default insert method

**Kind**: instance method of <code>[lowkieSchema](#lowkieSchema)</code>  
**Returns**: Promise  

| Param | Type |
| --- | --- |
| options | <code>any</code> | 

<a name="lowkieSchema.Types"></a>

### lowkieSchema.Types
schema data types

**Kind**: static property of <code>[lowkieSchema](#lowkieSchema)</code>  
<a name="connect"></a>

## connect([dbpath], [options]) ⇒ <code>Promise</code>
connects lowkie to lokijs

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| [dbpath] | <code>string</code> | <code>&quot;defaultDBPath&quot;</code> | 
| [options] | <code>object</code> | <code>{}</code> | 

<a name="handler"></a>

## handler() ⇒ <code>object</code>
this is the proxy handler for lowkie, provides access to native loki methods as well.

**Kind**: global function  
<a name="model"></a>

## model(model, Schema) ⇒
lowkie model proxy for lokijs collection

**Kind**: global function  
**Returns**: Proxy  

| Param | Type | Description |
| --- | --- | --- |
| model | <code>string</code> | name of lowkie model |
| Schema | <code>class</code> | instance of lokieSchema |

