//
//  EHMApi.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/19/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMApi.h"

@implementation EHMApi

//Base Url of the server
NSString *baseUrl = @"http://localhost:3000";

/*
 * Attempts to Login a User and return a user object when successful
 * otherwise we return a nil object if login failed
 */
// -(void)loginInApplicantForEmail:(NSString *)email password:(NSString *)password {
//     NSString *endPoint = [NSString stringWithFormat:@"%@/applicants/login", baseUrl];
//     NSURL *url = [NSURL URLWithString:endPoint];
//     NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:60.0];
//     
//     NSData *requestData = [[NSString stringWithFormat:@"email=%@&password=%@", email, password] dataUsingEncoding:NSUTF8StringEncoding];
//     
//     [request setHTTPMethod:@"POST"];
//     [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
//     [request setHTTPBody: requestData];
//     
//     [[NSURLConnection alloc] initWithRequest:request delegate:self];
// }

@end
