export interface ISupportNotifier {
    sendMessageToSupportChannel(message: string): Promise<any>
}
