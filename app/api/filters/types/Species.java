package api.filters.types;

import java.sql.Connection;
import java.sql.ResultSet;

import org.apache.commons.lang.WordUtils;

import play.Logger;

import utils.DatabaseUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class Species extends GenericFilter{
	
	public static class SQL {
		public static String GET_SPECIES = "SELECT DISTINCT species, id FROM hunt.species ORDER BY id ASC";
	}
	
	
	public static JsonElement getFilter(Connection conn) {
		JsonObject filter = new JsonObject();
		filter.addProperty("label", "Species");
		filter.addProperty("type", "qualitative");
		filter.addProperty("selector", "or");
		JsonArray range = new JsonArray();
		try{
			ResultSet rs = conn.prepareStatement(SQL.GET_SPECIES).executeQuery();
			while(rs.next()){
				JsonObject item = new JsonObject();
				item.addProperty("label", WordUtils.capitalize(rs.getString(1)));
				item.addProperty("value", rs.getInt(2));
				range.add(item);
			}
			
			
			
		}catch (Exception e){
			Logger.error(e,"Error getting species filter");
		}
		
		filter.add("range", range);

		return filter;
	}
	
	
	
	
	
}
