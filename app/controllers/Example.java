package controllers;

import play.Logger;
import play.mvc.Controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class Example extends Controller {

    public static void getFilters() {
    	
    	Logger.info("Example.getFilters");
    	
        JsonArray array = new JsonArray();
        
        JsonObject item1 = new JsonObject();
        item1.addProperty("id", 123);
        item1.addProperty("name", "Classical");
        array.add(item1);
        
        JsonObject item2 = new JsonObject();
        item2.addProperty("id", 456);
        item2.addProperty("name", "Jazz");
        array.add(item2);
        
        JsonObject item3 = new JsonObject();
        item3.addProperty("id", 789);
        item3.addProperty("name", "Electronic");
        array.add(item3);
        
        renderJSON(array.toString());
    }
    
    public static void getArtists() {
    	JsonArray array = new JsonArray();
    	
        JsonObject item1 = new JsonObject();
        item1.addProperty("id", 123);
        item1.addProperty("name", "Mozart");
        array.add(item1);
        
        JsonObject item2 = new JsonObject();
        item2.addProperty("id", 456);
        item2.addProperty("name", "Stevie Wonder");
        array.add(item2);
        
        JsonObject item3 = new JsonObject();
        item3.addProperty("id", 789);
        item3.addProperty("name", "Bolbbalgan4");
        array.add(item3);
        
        renderJSON(array.toString());
    }
    
    public static void saveArtist(String name) {
    	
    	Logger.info("Example.saveArtist: %s", name);
    	
    	JsonObject obj = new JsonObject();
    	obj.addProperty("id", 123);
    	obj.addProperty("name", name);
    	
    	renderJSON(obj.toString());
    }

}