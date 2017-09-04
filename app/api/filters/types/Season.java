package api.filters.types;

import java.sql.ResultSet;

import org.apache.commons.lang.WordUtils;

import play.Logger;
import api.filters.types.Residency.SQL;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class Season {

	public static JsonElement getFilter() {
		JsonObject filter = new JsonObject();
		filter.addProperty("label", "Season");
		filter.addProperty("type", "date");
		filter.addProperty("selector", "date_slider");
		
		JsonObject range = new JsonObject();
		range.addProperty("min", 0);
		range.addProperty("max", 365);
		filter.add("range" , range);
		
		return filter;
	}

}
