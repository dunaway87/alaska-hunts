package api.filters.types;

import java.sql.Connection;

import com.google.gson.JsonObject;

public class Rates {
	
	public static JsonObject getDrawRateFilter(Connection conn){
		return getRateFilter(conn, "Draw Rate");
	}
	
	public static JsonObject getHuntSuccessRatefilter(Connection conn){
		return getRateFilter(conn, "Hunt Success Rate");
	}
	
	private static JsonObject getRateFilter(Connection conn, String label){
		JsonObject filter = new JsonObject();
		filter.addProperty("label", label);
		filter.addProperty("parameter", label.toLowerCase().replace(" ", "_"));
		filter.addProperty("type", "dual_slider");
		
		JsonObject range = new JsonObject();
		range.addProperty("min", 0);
		range.addProperty("max", 100);
		filter.add("range" , range);
		
		
		return filter;

	}
	
	
	
}
