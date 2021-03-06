/// <reference path="../../lib/window.d.ts"/>

module webimmodel {


    export class Conversation {
        public title: string;
        public targetId: string;
        public targetType: any;
        public lastTime: Date;
        public lastMsg: string;
        public unReadNum: number;
        public draftMsg: string;
        public firstchar: string;
        public imgSrc: string;
        constructor(item?: {
            title: string,
            targetId: string,
            targetType: any,
            lastTime: Date,
            lastMsg: string,
            unReadNum: number,
            draftMsg: string,
            firstchar?: string
        }) {
            if (item) {
                this.title = item.title;
                this.targetId = item.targetId;
                this.targetType = item.targetType;
                this.lastTime = item.lastTime;
                this.lastMsg = item.lastMsg;
                this.unReadNum = item.unReadNum;
                this.draftMsg = item.draftMsg;
                this.firstchar = item.firstchar;
            }
        }

        static convertToWebIM(item: RongIMLib.Conversation) {
            var lasttime: Date;
            if (item.latestMessage && item.sentTime) {
                lasttime = new Date(item.sentTime);
            }

            var msgContent = ""
            if (item.latestMessage) {
                msgContent = Message.messageToNotification(item.latestMessage)
            }

            return new Conversation({
                title: item.conversationTitle || "",
                targetId: item.targetId || "",
                targetType: item.conversationType || "",
                lastTime: lasttime || new Date(),
                lastMsg: msgContent || "",
                unReadNum: item.unreadMessageCount,
                draftMsg: item.draft || ""
            })
        }
    }

    export enum MessageDirection {
        SEND = 1,
        RECEIVE = 2,
    }

    export enum ReceivedStatus {
        READ = 0x1,
        LISTENED = 0x2,
        DOWNLOADED = 0x4
    }

    export enum SentStatus {
        /**
         * 发送中。
         */
        SENDING = 10,
        /**
         * 发送失败。
         */
        FAILED = 20,
        /**
         * 已发送。
         */
        SENT = 30,
        /**
         * 对方已接收。
         */
        RECEIVED = 40,
        /**
         * 对方已读。
         */
        READ = 50,
        /**
         * 对方已销毁。
         */
        DESTROYED = 60,
    }

    export enum PanelType {
        Message = 1, InformationNotification = 2,
        System = 103, Time = 104, getHistory = 105, getMore = 106,
        Other = 0
    }

    export var MessageType = {
        DiscussionNotificationMessage: "DiscussionNotificationMessage",
        TextMessage: "TextMessage",
        ImageMessage: "ImageMessage",
        VoiceMessage: "VoiceMessage",
        RichContentMessage: "RichContentMessage",
        HandshakeMessage: "HandshakeMessage",
        HandShakeResponseMessage: "HandShakeResponseMessage",
        UnknownMessage: "UnknownMessage",
        SuspendMessage: "SuspendMessage",
        LocationMessage: "LocationMessage",
        InformationNotificationMessage: "InformationNotificationMessage",
        ContactNotificationMessage: "ContactNotificationMessage",
        ProfileNotificationMessage: "ProfileNotificationMessage",
        CommandNotificationMessage: "CommandNotificationMessage"
    }

    export enum conversationType {
        Private = 1, Discussion = 2, Group = 3, ChartRoom = 4, CustomerService = 5, System = 6, AppPublicService = 7, PublicService = 8
    }


    export enum NoticePanelType {
        ApplyFriend = 1, AgreedFriend = 2,
        WarningNotice = 101,
    }

    export enum FriendStatus {
        Requesting = 10, Requested = 11,
        Agreed = 20, Ignored = 21, Deleted = 30,
        GroupNotification = 101//群通知消息
    }

    export enum CommandNotificationMessageType {
        ApplyGroup = 1, InviteAddGroup = 2, KickOutGroup = 3,
        AcceptApplyGroup = 101, RejectApplyGroup = 102, AcceptInviteAddGroup = 201, RejectInviteAddGroup = 202
    }

    export class ChatPanel {
        panelType: PanelType
        constructor(type: PanelType) {
            this.panelType = type;
        }
    }



    export class Message extends ChatPanel {
        content: any;
        conversationType: any;
        extra: string;
        objectName: string;
        messageDirection: MessageDirection;
        messageId: string;
        receivedStatus: ReceivedStatus;
        receivedTime: Date;
        senderUserId: string;
        sentStatus: SentStatus;
        sentTime: Date;
        targetId: string;
        messageType: string;

        senderUserName: string
        senderUserImgSrc: string
        imgSrc: string

        constructor(content?: any, conversationType?: string, extra?: string, objectName?: string, messageDirection?: MessageDirection, messageId?: string, receivedStatus?: ReceivedStatus, receivedTime?: number, senderUserId?: string, sentStatus?: SentStatus, sentTime?: number, targetId?: string, messageType?: string) {
            super(PanelType.Message);
        }
        static convertMsg(SDKmsg: any) {

            var msg = new Message();
            msg.conversationType = SDKmsg.conversationType;
            msg.extra = SDKmsg.extra;
            msg.objectName = SDKmsg.objectName
            msg.messageDirection = SDKmsg.messageDirection;
            msg.messageId = SDKmsg.messageId;
            msg.receivedStatus = SDKmsg.receivedStatus;
            msg.receivedTime = new Date(SDKmsg.receivedTime);
            msg.senderUserId = SDKmsg.senderUserId;
            msg.sentStatus = SDKmsg.sendStatusMessage;
            msg.sentTime = new Date(SDKmsg.sentTime);
            msg.targetId = SDKmsg.targetId;
            msg.messageType = SDKmsg.messageType;

            switch (msg.messageType) {
                case MessageType.TextMessage:
                    var texmsg = new TextMessage();
                    var content = SDKmsg.content.content;
                    if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.emojiToHTML) {
                        content = RongIMLib.RongIMEmoji.emojiToHTML(content);
                    }
                    texmsg.content = content;

                    msg.content = texmsg;
                    break;
                case MessageType.ImageMessage:
                    var image = new ImageMessage();
                    var content = SDKmsg.content.content || "";
                    if (content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    image.content = content;
                    image.imageUri = SDKmsg.content.imageUri;

                    msg.content = image;
                    break;

                case MessageType.VoiceMessage:
                    var voice = new VoiceMessage();
                    voice.content = SDKmsg.content.content;
                    voice.duration = SDKmsg.content.duration;

                    msg.content = voice;
                    break;

                case MessageType.RichContentMessage:
                    var rich = new RichContentMessage();
                    rich.content = SDKmsg.content.content;
                    rich.title = SDKmsg.content.title;
                    rich.imageUri = SDKmsg.content.imageUri;

                    msg.content = rich;
                    break;
                case MessageType.LocationMessage:
                    var location = new LocationMessage();
                    var content = SDKmsg.content.content || "";
                    if (content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    location.content = content;
                    location.latiude = SDKmsg.content.latiude;
                    location.longitude = SDKmsg.content.longitude;
                    location.poi = SDKmsg.content.poi;

                    msg.content = location;
                    break;
                case MessageType.InformationNotificationMessage:
                    var info = new InformationNotificationMessage();
                    info.content = SDKmsg.content.message;

                    msg.content = info;
                    break;
                case MessageType.ContactNotificationMessage:
                    var contact = new ContactNotificationMessage();
                    contact.content = SDKmsg.content.message;
                    contact.operation = SDKmsg.content.operation;
                    contact.sourceUserId = SDKmsg.content.sourceUserId;
                    contact.targetUserId = SDKmsg.content.targetUserId;
                    contact.message = SDKmsg.content.content;

                    switch (contact.operation) {
                        case "Request":
                            contact.noticeType = NoticePanelType.ApplyFriend;
                            break;
                        case "AcceptResponse":
                            contact.noticeType = NoticePanelType.AgreedFriend;
                            contact.content = "同意加为好友"
                            break;
                        case "RejectResponse":
                            // tmp.noticeType = NoticePanelType.WarningNotice;
                            // tmp.content = "拒绝加为好友"
                            console.log("拒绝好友通知消息未支持");
                            break;
                    }
                    msg.content = contact;
                    break;
                case MessageType.CommandNotificationMessage:
                    var comm = new CommandNotificationMessage();
                    comm.noticeType = NoticePanelType.WarningNotice;
                    comm.data = SDKmsg.content.data;
                    comm.name = SDKmsg.content.name;
                    msg.content = comm;
                    break;
                case MessageType.DiscussionNotificationMessage:
                    // var discussion = new DiscussionNotificationMessage();
                    // discussion.extension = SDKmsg.content.extension;
                    // discussion.operation = SDKmsg.content.operation;
                    // discussion.type = SDKmsg.content.type;
                    // discussion.isHasReceived = SDKmsg.content.isHasReceived;
                    // msg.content = discussion;
                    // msg.panelType = webimmodel.PanelType.InformationNotification;
                    if (SDKmsg.objectName == "RC:DizNtf") {
                        var groupnot = new webimmodel.InformationNotificationMessage();
                        groupnot.content = SDKmsg.content.message;
                        msg.content = groupnot;
                        msg.panelType = webimmodel.PanelType.InformationNotification;
                    } else {
                        console.log("has unknown message type " + SDKmsg.messageType)
                    }
                    break;
                default:
                    if (SDKmsg.objectName == "RC:GrpNtf") {
                        var groupnot = new webimmodel.InformationNotificationMessage();
                        groupnot.content = SDKmsg.content.message;
                        msg.content = groupnot;
                        msg.panelType = webimmodel.PanelType.InformationNotification;
                    } else {
                        console.log("has unknown message type " + SDKmsg.messageType)
                    }
                    break;
            }
            if (msg.content) {
                msg.content.userInfo = SDKmsg.content.userInfo;
            }

            return msg;
        }

        static messageToNotification = function(msg: any) {
            if (!msg)
                return null;
            var msgtype = msg.messageType, msgContent: string;
            if (msgtype == MessageType.ImageMessage) {
                msgContent = "[图片]";
            } else if (msgtype == MessageType.LocationMessage) {
                msgContent = "[位置]";
            } else if (msgtype == MessageType.VoiceMessage) {
                msgContent = "[语音]";
            } else if (msgtype == MessageType.ContactNotificationMessage || msgtype == MessageType.CommandNotificationMessage) {
                msgContent = "[通知消息]";
            } else if (msg.objectName == "RC:GrpNtf") {
                var data = msg.content.message.content.data.data
                switch (msg.content.message.content.operation) {
                    case "Add":
                        msgContent = data.targetUserDisplayNames ? (data.targetUserDisplayNames.join("、") + " 加入了群组") : "加入群组";
                        break;
                    case "Quit":
                        msgContent = data.operatorNickname + " 退出了群组";
                        break;
                    case "Kicked":
                        //由于之前数据问题
                        msgContent = data.targetUserDisplayNames ? (data.targetUserDisplayNames.join("、") + " 被踢出群组") : "移除群组";
                        break;
                    case "Rename":
                        msgContent = data.operatorNickname + " 修改了群名称";
                        break;
                    case "Create":
                        msgContent = data.operatorNickname + " 创建了群组";
                        break;
                    case "Dismiss":
                        msgContent = data.operatorNickname + " 解散了群组 " + data.targetGroupName;
                        break;
                    default:
                        break;
                }
            } else if (msg.objectName == "RC:DizNtf") {
                var data = msg
                // var members = msg.content.extension.split(',');
                // for (var i = 0, len = members.length; i < len; i++) {
                //     mainServer.user.getInfo(members[i]).success(function (rep) {
                //         if (item.content === comment) {
                //             item.content = rep.result.nickname + item.content;
                //         }
                //         else {
                //             item.content = rep.result.nickname + "、" + item.content;
                //         }
                //     });
                // }
                switch (msg.content.type) {
                    case 1:
                        msgContent = " 加入了讨论组";
                        break;
                    case 2:
                        msgContent =  " 退出了讨论组";
                        break;
                    case 4:
                        //由于之前数据问题
                        msgContent = " 被踢出讨论组";
                        break;
                    case 3:
                        msgContent = " 修改了讨论组名称";
                        break;
                    default:
                        break;
                }
            }
            else {
                msgContent = msg.content ? msg.content.content : "";

                msgContent = webimutil.Helper.escapeSymbol.escapeHtml(msgContent);
                msgContent = RongIMLib.RongIMEmoji.emojiToSymbol(msgContent);
                // if (!webimutil.Helper.browser.chrome) {
                msgContent = msgContent.replace(/\n/g, " ");
                msgContent = msgContent.replace(/([\w]{49,50})/g, "$1 ");
                // }

            }
            return msgContent;
        }

    }


    export class ContactNotificationMessage extends Message {
        operation: string;
        sourceUserId: string;
        targetUserId: string;
        message: string;
        noticeType: number;
    }

    export class CommandNotificationMessage extends Message {
        name: string;
        data: any;
        noticeType: number;
    }


    export class TextMessage {
        userInfo: UserInfo;
        content: string;
        constructor(msg?: any) {
            msg = msg || {};
            this.content = msg.content;
            this.userInfo = msg.userInfo;
        }
    }
    export class InformationNotificationMessage {
        userInfo: UserInfo;
        content: string;
        extra: string;
        messageName: string;
    }

    export class ImageMessage {
        userInfo: UserInfo;
        content: string;
        imageUri: string;
    }

    export class VoiceMessage {
        userInfo: UserInfo;
        content: string;
        duration: string;
    }

    export class LocationMessage {
        userInfo: UserInfo;
        content: string;
        latiude: number;
        longitude: number;
        poi: string;
    }

    export class RichContentMessage {
        userInfo: UserInfo;
        content: string;
        title: string;
        imageUri: string;
    }

    export class DiscussionNotificationMessage {
        userInfo: UserInfo;
        extension: string;
        type: number;
        isHasReceived: boolean;
        operation: string;
        extra: string;
        messageName: string;
    }

    export class GetHistoryPanel extends ChatPanel {
        constructor() {
            super(PanelType.getHistory)
        }
    }

    export class GetMoreMessagePanel extends ChatPanel {
        constructor() {
            super(PanelType.getMore)
        }
    }

    export class TimePanl extends ChatPanel {
        sendTime: Date
        constructor(time: Date) {
            super(PanelType.Time)
            this.sendTime = time;
        }
    }

    export class WarningNoticeMessage {
        status: number;
        content: string;
        timestamp: number;//用于通知消息排序
        constructor(content: string) {
            this.content = content;
            this.status = webimmodel.FriendStatus.GroupNotification
        }
    }


    export class NotificationFriend {
        id: string
        name: string
        portraitUri: string
        content: string
        status: string
        timestamp: number//用于通知消息排序
        firstchar: string

        constructor(item: {
            id: string,
            name: string,
            portraitUri: string,
            content: string,
            status: string
            timestamp: number
        }) {
            this.id = item.id;
            this.name = item.name;
            this.portraitUri = item.portraitUri;
            this.content = item.content;
            this.status = item.status;
            this.timestamp = item.timestamp;
        }

    }


    export class UserInfo {
        constructor(public id?: string,
            public nickName?: string,
            public portraitUri?: string,
            public phone?: string,
            public region?: string,
            public firstchar?: string) { }
    }

    export class Contact {
        id: string;
        name: string;
        imgSrc: string;
        pinyin: string;
        everychar: string;
        firstchar: string;
        displayName: string;

        constructor(item?: {
            id: string;
            name: string;
            imgSrc: string;
        }) {
            this.id = item.id;
            this.name = item.name;
            this.imgSrc = item.imgSrc;
        }

        setpinying(item: {
            pinyin: string;
            everychar: string;
            firstchar: string;
        }) {
            this.pinyin = item.pinyin;
            this.everychar = item.everychar;
            this.firstchar = item.firstchar;
        }
    }
    export class Friend extends Contact {
        displayName: string
        mobile: string
        constructor(item: {
            id: string;
            name: string;
            imgSrc: string;
        }) {
            super(item);
        }
    }

    export class Subgroup {
        title: string
        list: Friend[]
        constructor(title: string, list: Friend[]) {
            this.title = title;
            this.list = list;
        }
    }

    export class Group extends Contact {
        upperlimit: number;
        fact: number;
        creater: string;
        memberList: Member[];

        constructor(item: {
            id: string;
            name: string;
            imgSrc: string;
            upperlimit: number;
            fact: number;
            creater: string;
        }) {
            super(item);
            this.upperlimit = item.upperlimit;
            this.fact = item.fact;
            this.creater = item.creater;
            this.memberList = []
        }

    }

    export class Discussion extends Contact {
        upperlimit: number;
        fact: number;
        creater: string;
        memberList: Member[];

        constructor(item: {
            id: string;
            name: string;
            imgSrc: string;
            upperlimit: number;
            fact: number;
            creater: string;
            isOpen: boolean;
        }) {
            super(item);
            this.upperlimit = item.upperlimit;
            this.fact = item.fact;
            this.creater = item.creater;
            this.memberList = []
        }

    }

    export class Member extends Contact {
        id: string;
        name: string;
        imgSrc: string;
        role: string;
        displayName: string;
        // pinyin: string;
        // first: string;
        constructor(item: {
            id: string;
            name: string;
            imgSrc: string;
            role?: string;
        }) {
            super(item);
            this.role = item.role;
        }
    }

}
