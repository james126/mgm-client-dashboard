import { Injectable } from "@angular/core";
import { INGXLoggerMetadata, NGXLoggerServerService } from "ngx-logger";


@Injectable()
export class ServerCustomisedService extends NGXLoggerServerService {

    /**
     * Customise the data sent to the API
     * @param metadata the data provided by NGXLogger
     * @returns the data customised
     */
    public override customiseRequestBody(metadata: INGXLoggerMetadata): any {
        let body = { ...metadata };
        body['message'] = metadata.message.toString();

        return body;
    }
}
