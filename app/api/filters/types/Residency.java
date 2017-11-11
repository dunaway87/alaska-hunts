package api.filters.types;

import java.sql.Connection;
import java.sql.ResultSet;

import org.apache.commons.lang.WordUtils;

import play.Logger;
import api.filters.types.Species.SQL;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class Residency {
	public static class SQL {
		public static String GET_SPECIES = "SELECT DISTINCT residency, id FROM hunt.residency ORDER BY id ASC";
	}
	
	
	public static JsonElement getFilter(Connection conn) {
		JsonObject filter = new JsonObject();
		filter.addProperty("label", "Residency");
		filter.addProperty("parameter", "residency");
		filter.addProperty("type", "qualitative");
		filter.addProperty("selector", "and");
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
