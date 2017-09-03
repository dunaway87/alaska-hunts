package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import com.google.gson.JsonArray;

import api.filters.Filters;
import models.*;

public class Application extends Controller {

    public static void index() {
        render();
    }

    public static void getFilters(){
		JsonArray filters = Filters.getFilters();
		
		
		
		renderJSON(filters);
	}

    
}