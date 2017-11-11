package api.filters.types;

import java.sql.Connection;
import java.sql.ResultSet;

import org.apache.commons.lang.WordUtils;

import play.Logger;
import api.filters.types.Residency.SQL;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class Unit {
	public static class SQL {
		public static String GET_UNIT = "SELECT DISTINCT unit FROM hunt.draw_hunt ORDER BY unit ASC";
		public static String GET_SUBUNIT = "SELECT DISTINCT subunit,id FROM hunt.subunit ORDER BY subunit ASC";
	}
	
	public static JsonElement getSubunitFilter(Connection conn){
		JsonObject filter = new JsonObject();
		filter.addProperty("label", "Subunit");
		filter.addProperty("parameter", "subunit");
		filter.addProperty("type", "qualitative");
		filter.addProperty("selector", "and");
		JsonArray range = new JsonArray();
		try{
			ResultSet rs = conn.prepareStatement(SQL.GET_SUBUNIT).executeQuery();
			while(rs.next()){
				JsonObject item = new JsonObject();
				item.addProperty("label", rs.getString(1));
				item.addProperty("value", rs.getInt(2));
				range.add(item);
			}
			
			
			
		}catch (Exception e){
			Logger.error(e,"Error getting species filter");
		}
		
		filter.add("range", range);

		return filter;
	}
	
	
	public static JsonElement getUnitFilter(Connection conn) {
		JsonObject filter = new JsonObject();
		filter.addProperty("label", "Unit");
		filter.addProperty("parameter", "unit");

		filter.addProperty("type", "qualitative");
		filter.addProperty("selector", "and");
		JsonArray range = new JsonArray();
		try{
			ResultSet rs = conn.prepareStatement(SQL.GET_UNIT).executeQuery();
			while(rs.next()){
				JsonObject item = new JsonObject();
				item.addProperty("label", rs.getInt(1));
				item.addProperty("value", rs.getInt(1));
				range.add(item);
			}
			
			
			
		}catch (Exception e){
			Logger.error(e,"Error getting species filter");
		}
		
		filter.add("range", range);

		return filter;
	}
	
}
