package com.example.comp539_team2_backend.configs;

import com.google.api.gax.rpc.ServerStream;
import com.google.cloud.bigtable.data.v2.BigtableDataClient;
import com.google.cloud.bigtable.data.v2.models.*;
import com.google.api.gax.rpc.NotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import com.google.cloud.bigtable.data.v2.models.Row;
import com.google.cloud.bigtable.data.v2.models.Filters;

import static com.google.cloud.bigtable.data.v2.models.Filters.*;
import com.google.protobuf.ByteString;


@Repository
public class BigtableRepository {

//    private final org.apache.hadoop.conf.Configuration config;
    private final String tableId;
    private static final Logger LOGGER = Logger.getLogger(BigtableRepository.class.getName());
    private final BigtableDataClient client;

    @Autowired
    public BigtableRepository(BigtableDataClient client, @Value("$bigtable.tableId") String tableId) {
        this.client = client;
        this.tableId = tableId;
    }



    public void save(String rowKey, String columnFamily, String columnQualifier, String data) throws IOException {
        try {
            RowMutation mutation = RowMutation.create(tableId, rowKey)
                    .setCell(columnFamily, columnQualifier, data);
            client.mutateRow(mutation);
            LOGGER.info("Data saved successfully for rowKey: " + rowKey);
        } catch (NotFoundException e) {
            LOGGER.severe("Failed to save data for rowKey " + rowKey + ": " + e.getMessage());
        }
    }

    public String get(String rowKey, String columnFamily, String columnQualifier) {
        try {
            // 使用chain()方法组合多个过滤条件
            Filter filter = FILTERS.chain()
                    .filter(FILTERS.family().exactMatch(columnFamily))
                    .filter(FILTERS.qualifier().exactMatch(columnQualifier));

            // 读取行数据
            Row row = client.readRow(tableId, rowKey, filter);

            // 检查行数据是否不为空，并且特定列有值
            if (row != null && !row.getCells(columnFamily, columnQualifier).isEmpty()) {
                // 获取该列的值
                String value = row.getCells(columnFamily, columnQualifier).get(0).getValue().toStringUtf8();
                LOGGER.info("Retrieved data successfully for rowKey: " + rowKey);
                return value;
            } else {
                LOGGER.info("No data found for rowKey: " + rowKey);
                return null;
            }
        } catch (NotFoundException e) {
            LOGGER.severe("Row not found for rowKey " + rowKey + ": " + e.getMessage());
            return null;
        }
    }





//    public void deleteColumn(String rowKey, String columnFamily, String columnQualifier) throws IOException {
//        try (Connection conn = ConnectionFactory.createConnection(config);
//             Table table = conn.getTable(TableName.valueOf(tableId))) {
//            Delete delete = new Delete(Bytes.toBytes(rowKey));
//            delete.addColumn(Bytes.toBytes(columnFamily), Bytes.toBytes(columnQualifier));
//            table.delete(delete);
//            LOGGER.info("Column deleted successfully for rowKey: " + rowKey);
//        } catch (IOException e) {
//            Throwable cause = e.getCause();
//            Objects.requireNonNullElse(cause, e).printStackTrace();
//            LOGGER.severe("Failed to delete column for rowKey " + rowKey + ": " + e.getCause().getMessage());
//            throw e;
//        }
//    }

    public void clearAllData() {
        try {
            // Retrieve all rows from the table
            Query allRowsQuery = Query.create(tableId);
            ServerStream<Row> rows = client.readRows(allRowsQuery);
            // Iterate through each row and delete it
            for (Row row : rows) {
                String rowKey = row.getKey().toStringUtf8();
                RowMutation deleteMutation = RowMutation.create(tableId, rowKey).deleteRow();
                client.mutateRow(deleteMutation);
            }
            LOGGER.info("All data cleared from table: " + tableId);
        } catch (NotFoundException e) {
            LOGGER.severe("Failed to clear data: " + e.getMessage());
        }
    }


    public void deleteRow(String rowKey) {
        try {
            RowMutation mutation = RowMutation.create(tableId, rowKey).deleteRow();
            client.mutateRow(mutation);
            LOGGER.info("Row deleted successfully for rowKey: " + rowKey);
        } catch (NotFoundException e) {
            LOGGER.severe("Failed to delete row for rowKey " + rowKey + ": " + e.getMessage());
        }
    }

    public void updateExpiration(String email) {
        Filters.Filter filter = Filters.FILTERS.qualifier().exactMatch("creator");

        Query query = Query.create(tableId).filter(filter);

        ServerStream<Row> rows = client.readRows(query);

        for (Row row : rows) {
            String value = row.getCells("url", "creator").get(0).getValue().toStringUtf8();
            if (email.equals(value)) {
                String rowKey = row.getKey().toStringUtf8();
                RowMutation mutation = RowMutation.create(tableId, rowKey)
                        .setCell("url", "expiredAt", "NEVER");
                client.mutateRow(mutation);
            }
        }
        LOGGER.info("Finished updating expiration for user: " + email);
    }

    public boolean save_a(String rowKey, String columnFamily, String columnQualifier, String data) throws IOException {
       try {
            RowMutation mutation = RowMutation.create(tableId, rowKey)
                    .setCell(columnFamily, columnQualifier, data);
            client.mutateRow(mutation);
            LOGGER.info(" BigtableRespository: save_a : Data saved successfully for rowKey: " + rowKey);
            return true;
        } catch (NotFoundException e) {
            LOGGER.severe("BigtableRespository: save_a :Failed to save data for rowKey " + rowKey + ": " + e.getMessage());
        }
        return false;
    }

    public  List<String> getHistory(String email) throws IOException {
        List<String> short_urls = new ArrayList<>();
        try{
            Filters.Filter filter = Filters.FILTERS.qualifier().exactMatch("creator");

            Query query = Query.create(tableId).filter(filter);
            ServerStream<Row> rows = client.readRows(query);
            for (Row row : rows) {
                String value = row.getCells("url", "creator").get(0).getValue().toStringUtf8();
                if (email.equals(value)) {
                    String rowKey = row.getKey().toStringUtf8();
                    short_urls.add("https://snaplink.surge.sh/"+rowKey);
                }
            }
            return short_urls;
        }
        catch(NotFoundException e)
        {
            LOGGER.severe("BigtableRespository: save_a :Failed to retrieve shorturls for  " + email + ": " + e.getMessage());
        }
      
        return short_urls;
    }

}


